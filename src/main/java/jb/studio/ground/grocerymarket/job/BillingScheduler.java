// src/main/java/jb/studio/ground/grocerymarket/job/BillingScheduler.java
package jb.studio.ground.grocerymarket.job;

import jb.studio.ground.grocerymarket.service.IamportService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BillingScheduler {

    private final IamportService iamportService;

    // 매일 10:00 실행 (Asia/Seoul)
    @Scheduled(cron = "0 0 10 * * *", zone = "Asia/Seoul")
    public void run() {
        String token = iamportService.issueToken();

        // TODO: DB에서 앵커일 ±5일 대상 구독 조회
        List<Subscription> dueList = List.of(
                new Subscription("user-123-plan-MONTHLY_BASIC", new BigDecimal("10000"))
        );

        for (var sub : dueList) {
            String merchantUid = "sub-renew-" + System.currentTimeMillis();
            iamportService.chargeAgain(token, sub.customerUid(), merchantUid, sub.amount());
            // TODO: 성공/실패 이력 저장
        }
    }

    record Subscription(String customerUid, BigDecimal amount) {}
}
