// src/main/java/jb/studio/ground/grocerymarket/controller/PaymentController.java
package jb.studio.ground.grocerymarket.controller;

import jb.studio.ground.grocerymarket.service.IamportService;
import lombok.Data;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
public class PaymentController {

    private final IamportService iamportService;

    public PaymentController(IamportService iamportService) {
        this.iamportService = iamportService;
    }

    // 프론트: 정기결제 준비 (customerUid/merchantUid/구매자/PG MID 내려주기)
    @PostMapping(value="/api/payments/iamport/prepare", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> prepare(@RequestBody PrepareReq req) {
        // TODO 로그인 사용자 정보로 buyer/uid 구성 (아래는 예시 하드코딩)
        String customerUid = "user-123-plan-" + req.getPlanCode();
        String merchantUid = "sub-" + System.currentTimeMillis();

        var buyer = Map.of(
                "email", "user@example.com",
                "name",  "홍길동",
                "tel",   "010-1234-5678"
        );

        return Map.of(
                "customerUid", customerUid,
                "merchantUid", merchantUid,
                "buyer", buyer,
                "pgMid", "A010002002" // 다날-휴대폰 정기(빌링) 테스트 MID
        );
    }

    // 프론트: 최초결제 콜백 완료 → 검증
    @PostMapping("/api/payments/iamport/complete")
    public Map<String, Object> complete(@RequestBody CompleteReq req) {
        String token = iamportService.issueToken();
        var payment = iamportService.getPaymentByImpUid(token, req.getImpUid());

        boolean ok = payment.getMerchant_uid().equals(req.getMerchantUid())
                && payment.getAmount().compareTo(req.getAmount()) == 0
                && "paid".equals(payment.getStatus());
        if (!ok) throw new IllegalStateException("결제 검증 실패");

        // TODO: 구독 저장/갱신 (customerUid, planCode, amount, 다음 청구 앵커일 등)
        return Map.of("result", "ok");
    }

    // ====== Request DTOs ======
    @Data
    public static class PrepareReq {
        private String planCode;
        private BigDecimal amount;
    }

    @Data
    public static class CompleteReq {
        private String impUid;
        private String merchantUid;
        private String customerUid;
        private BigDecimal amount;
        private String planCode;
    }
}
