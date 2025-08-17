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

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 1) 토큰에서 role 클레임 읽기
            String role = null;
            try {
                Object raw = jwtTokenProvider.extractAllClaims(token).get("role");
                if (raw != null) role = String.valueOf(raw);
            } catch (Exception ignore) {}

            List<GrantedAuthority> authorities = new ArrayList<>();
            if (role != null && !role.isBlank()) {
                String normalized = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase();
                authorities.add(new SimpleGrantedAuthority(normalized));
            }

            // 2) (선택) DB 권한 보강
            try {
                UserDetails user = userDetailsService.loadUserByUsername(email);
                if (authorities.isEmpty()) { // 토큰에 role 없으면 DB 권한 사용
                    authorities.addAll(user.getAuthorities());
                }
            } catch (UsernameNotFoundException ex) {
                log.info("DB 사용자 없음: {} (JWT 권한만 사용)", email);
            }

            // 3) 토큰 유효성 검사 후 인증 주입
            if (jwtTokenProvider.validateToken(token, email)) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                if (log.isDebugEnabled()) {
                    log.debug("인증 주입: email={}, authorities={}", email, authorities);
                }
            }
        }

        chain.doFilter(request, response);
    }
}
