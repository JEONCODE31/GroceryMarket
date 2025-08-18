package jb.studio.ground.grocerymarket.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jb.studio.ground.grocerymarket.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String auth = request.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = auth.substring(7);

        String email;
        try {
            email = jwtTokenProvider.extractEmail(token); // subject = email
        } catch (Exception e) {
            log.warn("JWT 파싱 실패: {}", e.getMessage());
            chain.doFilter(request, response);
            return;
        }

        // 이미 인증돼 있지 않고 이메일이 있을 때만 진행
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 토큰 유효성 검사 (만료/서명 등)
            if (!jwtTokenProvider.validateToken(token, email)) {
                chain.doFilter(request, response);
                return;
            }

            // 1) 토큰에서 role 클레임 추출 (String 또는 배열/List 모두 대응)
            Set<GrantedAuthority> authorities = new HashSet<>();
            try {
                Object rawRole = jwtTokenProvider.extractAllClaims(token).get("role");
                if (rawRole instanceof Collection<?> col) {
                    for (Object r : col) {
                        if (r != null) {
                            String normalized = normalizeRole(String.valueOf(r));
                            authorities.add(new SimpleGrantedAuthority(normalized));
                        }
                    }
                } else if (rawRole != null) {
                    String normalized = normalizeRole(String.valueOf(rawRole));
                    authorities.add(new SimpleGrantedAuthority(normalized));
                }
            } catch (Exception ignore) {}

            // 2) DB에서 사용자 + 권한 로딩 (CustomUserDetails여야 함)
            CustomUserDetails principal;
            try {
                UserDetails loaded = userDetailsService.loadUserByUsername(email);
                if (!(loaded instanceof CustomUserDetails)) {
                    // 서비스가 반드시 CustomUserDetails를 반환해야 컨트롤러에서 getUserId() 사용 가능
                    log.error("CustomUserDetailService는 CustomUserDetails를 반환해야 합니다. 현재 타입: {}", loaded.getClass().getName());
                    chain.doFilter(request, response);
                    return;
                }
                principal = (CustomUserDetails) loaded;

                // 토큰에 권한이 없었다면 DB 권한 사용, 있었다면 합집합으로 구성
                if (authorities.isEmpty()) {
                    authorities.addAll(principal.getAuthorities());
                } else {
                    authorities.addAll(principal.getAuthorities());
                }

            } catch (UsernameNotFoundException ex) {
                log.info("DB 사용자 없음: {} (토큰만으로 인증하지 않음)", email);
                chain.doFilter(request, response);
                return;
            }

            // 3) Authentication 생성 시 principal에 CustomUserDetails 주입
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, new ArrayList<>(authorities));
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            if (log.isDebugEnabled()) {
                log.debug("인증 주입: email={}, authorities={}", email, authorities);
            }
        }

        chain.doFilter(request, response);
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) return "ROLE_USER";
        String r = role.trim();
        return r.startsWith("ROLE_") ? r : "ROLE_" + r.toUpperCase();
    }
}
