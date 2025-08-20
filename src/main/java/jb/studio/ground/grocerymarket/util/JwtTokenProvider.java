package jb.studio.ground.grocerymarket.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.milliseconds}")
    private long expirationMilliseconds;

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /** JWT 생성: subject=email, role 클레임 포함 */
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();

        // ⭐️ 전달받은 역할에 "ROLE_" 접두사를 추가합니다.
        claims.put("role", "ROLE_" + role.toUpperCase());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMilliseconds))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /** subject=email */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // ⚠️ 수정된 부분: getEmailFromJwt 메서드 삭제 및 extractEmail로 통일
    // getEmailFromJwt는 extractEmail과 동일한 기능을 수행하므로 중복을 피하기 위해 하나만 남겨둡니다.

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    /** 토큰 유효성 검사 */
    public Boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

    // ⚠️ 추가된 부분: JwtAuthenticationFilter에서 사용할 validateToken 메서드
    public Boolean validateToken(String token) {
        return !isTokenExpired(token);
    }


    /** (선택) role 헬퍼 */
    public String getRole(String token) {
        Object raw = extractAllClaims(token).get("role");
        return raw == null ? null : String.valueOf(raw);
    }
}