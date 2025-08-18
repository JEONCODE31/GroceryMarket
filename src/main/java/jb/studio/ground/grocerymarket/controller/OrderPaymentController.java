package jb.studio.ground.grocerymarket.controller;

import lombok.Data;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")   // ← 프론트의 /api/order/prepare 와 맞춤
public class OrderPaymentController {

    @PostMapping("/prepare")
    public Map<String, Object> prepare(@RequestBody OrderPrepareReq req) {
        // TODO: 여기서 실제 다날 직연동 결제 준비(API) 호출로 TID 등을 받아오면 됩니다.
        //      지금은 프론트 흐름 확인용 더미 응답을 반환합니다.
        return Map.of(
                "cpid", "A010002002",
                "tid", "T" + System.currentTimeMillis(),
                "orderId", "order-" + System.currentTimeMillis(),
                "amount", req.getTotalPayment(),
                "itemName", "장바구니 결제",
                "userName", "홍길동",
                "userTel", "010-1234-5678"
        );
    }

    @Data
    public static class OrderPrepareReq {
        private List<Item> cartItems;
        private Integer totalPayment;

        @Data
        public static class Item {
            private Integer productId;
            private Integer quantity;
        }
    }
}
