package jb.studio.ground.grocerymarket.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long id;
    private Long userId;
    private Long amount;
    private String status;       // "결제완료" 등
    private String impUid;       // iamport imp_uid
    private String merchantUid;  // iamport merchant_uid
    private String method;       // "card" 등
    private java.time.LocalDateTime createdAt;

    private java.util.List<OrderItem> items;
    // getter/setter
}
