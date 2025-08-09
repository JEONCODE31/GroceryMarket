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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");
        String jwtToken = null;
        String userEmail = null;

        logger.debug("요청 URI: {}", request.getRequestURI());
        logger.debug("Authorization 헤더 존재 여부: {}", (authorizationHeader != null));

        // 1. Authorization 헤더에서 토큰 추출
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7); // "Bearer " 제거
            logger.debug("JWT 토큰 추출 성공: {}", jwtToken);
            try {
                userEmail = jwtTokenProvider.extractEmail(jwtToken); // 이메일 추출
                logger.debug("JWT 토큰에서 추출된 이메일: {}", userEmail);
            } catch (Exception e) {
                logger.error("JWT 토큰에서 이메일 추출 실패: {}", e.getMessage());
            }
        } else {
            logger.debug("Authorization 헤더가 없거나 'Bearer '로 시작하지 않음");
        }

        // 2. 유효한 이메일이 있고, 현재 인증되지 않은 경우
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = null;
            try {
                userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                logger.debug("UserDetails 로드 성공: {}", userDetails.getUsername());
            } catch (UsernameNotFoundException e) {
                logger.warn("사용자 '{}'를 찾을 수 없음: {}", userEmail, e.getMessage());
                // 사용자가 없을 경우 인증을 건너뛰고 다음 필터로 진행
                filterChain.doFilter(request, response);
                return;
            }

            // 3. 토큰 유효성 검사
            if (jwtTokenProvider.validateToken(jwtToken, userDetails.getUsername())) {
                // 인증 토큰 생성 및 SecurityContext에 설정
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.debug("인증 성공: SecurityContext에 인증 정보가 설정됨");
            } else {
                logger.warn("JWT 토큰이 유효하지 않거나 만료됨");
            }
        } else {
            if (userEmail == null) {
                logger.debug("이메일이 null이므로 인증을 건너뜁니다.");
            } else {
                logger.debug("이미 인증된 요청입니다. (인증 정보: {})", SecurityContextHolder.getContext().getAuthentication().getName());
            }
        }

        filterChain.doFilter(request, response);
    }
}