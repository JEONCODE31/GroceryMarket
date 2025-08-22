package jb.studio.ground.grocerymarket.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jb.studio.ground.grocerymarket.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailService customUserDetailService; // principal을 CustomUserDetails로 세팅하기 위해 주입

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // Authorization 없거나 Bearer 아님 → 다음 필터로
        if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            // 1) 토큰 파싱 (JwtTokenProvider에서 서명/형식 검증)
            Claims claims = jwtTokenProvider.extractAllClaims(token);

            // 2) 만료 체크 → 만료면 401로 즉시 종료
            Date exp = claims.getExpiration();
            if (exp != null && exp.before(new Date())) {
                writeUnauthorized(response, "TOKEN_EXPIRED");
                return;
            }

            // 3) 사용자 로드 및 Authentication 구성
            String email = claims.getSubject(); // sub = 이메일(사용자명)
            var userDetails = customUserDetailService.loadUserByUsername(email);
            if (userDetails == null) {
                writeUnauthorized(response, "UNAUTHORIZED");
                return;
            }

            var authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,               // ⬅ principal: CustomUserDetails
                    null,
                    userDetails.getAuthorities() // DB/서비스에서 부여된 권한 사용(예: ROLE_ADMIN)
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (ExpiredJwtException e) {
            // 만료 → 401
            writeUnauthorized(response, "TOKEN_EXPIRED");
            return;
        } catch (JwtException | IllegalArgumentException e) {
            // 서명 오류/형식 오류/기타 파싱 실패 → 401
            writeUnauthorized(response, "UNAUTHORIZED");
            return;
        }

        // 정상일 때만 다음 필터/컨트롤러로
        chain.doFilter(request, response);
    }

    private void writeUnauthorized(HttpServletResponse response, String code) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"code\":\"" + code + "\"}");
    }
}
