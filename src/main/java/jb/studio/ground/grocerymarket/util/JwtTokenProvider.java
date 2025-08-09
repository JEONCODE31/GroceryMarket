package jb.studio.ground.grocerymarket.util; // 변경: 패키지명 변경

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

    /**
     * JWT 토큰을 생성합니다. 주체(Subject)로 이메일을 사용합니다.
     * @param email 토큰의 주체(Subject)가 될 사용자의 이메일
     * @param role 사용자의 역할(권한)
     * @return 생성된 JWT 문자열
     */
    public String generateToken(String email, String role) { // 변경: 'username' -> 'email'
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email) // 변경: 토큰의 Subject를 'email'로 설정
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

    /**
     * 토큰에서 이메일(Subject)을 추출합니다.
     * @param token JWT 문자열
     * @return 토큰에서 추출된 이메일 문자열
     */
    public String extractEmail(String token) { // 변경: 'extractUsername' -> 'extractEmail'
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    /**
     * 토큰의 유효성을 검증합니다. 추출된 이메일과 주어진 이메일이 일치하고, 토큰이 만료되지 않았는지 확인합니다.
     * @param token JWT 문자열
     * @param email 검증할 사용자의 이메일
     * @return 토큰이 유효하면 true, 아니면 false
     */
    public Boolean validateToken(String token, String email) { // 변경: 'username' -> 'email'
        final String extractedEmail = extractEmail(token); // 변경: 'extractUsername' -> 'extractEmail'
        return (extractedEmail.equals(email) && !isTokenExpired(token)); // 변경: 'extractedUsername' -> 'extractedEmail', 'username' -> 'email'
    }
}