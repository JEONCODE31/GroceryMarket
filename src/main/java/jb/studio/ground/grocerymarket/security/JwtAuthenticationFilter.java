package jb.studio.ground.grocerymarket.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jb.studio.ground.grocerymarket.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.AntPathMatcher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailService customUserDetailService;

    // ⚠️ 수정된 부분: 토큰 검증을 생략할 경로를 정의
    private static final List<String> NO_AUTH_PATHS = Arrays.asList(
            "/api/payments/**",
            "/register",
            "/login",
            "/",
            "/foodresult",
            "/welfareresult",
            "/api/products/**",
            "/uploads/**",
            "/product/**",
            "/api/inquiries/**"
    );

    // ⚠️ 수정된 부분: 이 경로들에 대해서는 필터를 실행하지 않음
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // AntPathMatcher를 사용하여 와일드카드를 포함한 경로를 정확히 매칭합니다.
        AntPathMatcher pathMatcher = new AntPathMatcher();
        return NO_AUTH_PATHS.stream()
                .anyMatch(path -> pathMatcher.match(path, request.getServletPath()));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String jwt = getJwtFromRequest(request);

            // ⚠️ 수정된 부분: jwtTokenProvider.extractEmail(jwt) 한 번만 호출
            if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
                String email = jwtTokenProvider.extractEmail(jwt);
                UserDetails userDetails = customUserDetailService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}