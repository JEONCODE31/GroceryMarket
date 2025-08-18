// src/main/java/jb/studio/ground/grocerymarket/service/IamportService.java
package jb.studio.ground.grocerymarket.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class IamportService {

    @Value("${iamport.api-key}")
    private String apiKey;

    @Value("${iamport.api-secret}")
    private String apiSecret;

    private final RestTemplate rest = new RestTemplate();

    public String issueToken() {
        String url = "https://api.iamport.kr/users/getToken";
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        var body = Map.of("imp_key", apiKey, "imp_secret", apiSecret);
        ResponseEntity<TokenRes> res = rest.postForEntity(url, new HttpEntity<>(body, headers), TokenRes.class);
        if (!res.getStatusCode().is2xxSuccessful() || res.getBody()==null || res.getBody().response==null)
            throw new IllegalStateException("포트원 토큰 발급 실패");
        return res.getBody().response.access_token;
    }

    public Payment getPaymentByImpUid(String accessToken, String impUid) {
        String url = "https://api.iamport.kr/payments/" + impUid;
        var headers = new HttpHeaders();
        headers.set("Authorization", accessToken); // Bearer 없이 토큰 문자열 사용
        ResponseEntity<PaymentRes> res = rest.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), PaymentRes.class);
        if (!res.getStatusCode().is2xxSuccessful() || res.getBody()==null || res.getBody().response==null)
            throw new IllegalStateException("결제 단건 조회 실패");
        return res.getBody().response;
    }

    public void chargeAgain(String accessToken, String customerUid, String merchantUid, BigDecimal amount) {
        String url = "https://api.iamport.kr/subscribe/payments/again";
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", accessToken);
        var body = Map.of(
                "customer_uid", customerUid,
                "merchant_uid", merchantUid,
                "amount", amount
        );
        ResponseEntity<Map> res = rest.postForEntity(url, new HttpEntity<>(body, headers), Map.class);
        if (!res.getStatusCode().is2xxSuccessful())
            throw new IllegalStateException("정기 재결제(again) 실패");
    }

    // DTOs
    @Data @JsonIgnoreProperties(ignoreUnknown = true)
    static class TokenRes { Token response;
        @Data static class Token { String access_token; }
    }

    @Data @JsonIgnoreProperties(ignoreUnknown = true)
    static class PaymentRes { Payment response; }

    @Data @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Payment {
        private String imp_uid;
        private String merchant_uid;
        private String status;  // paid / failed / ready ...
        private BigDecimal amount;
        private String pay_method;
    }
}
