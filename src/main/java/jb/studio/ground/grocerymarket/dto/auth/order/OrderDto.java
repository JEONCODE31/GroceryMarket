package jb.studio.ground.grocerymarket.dto.auth.order;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderDto {

    private Long orderId;
    private Long userId;
    private String userEmail; // 사용자 이메일 (DB 조인을 통해 가져옴)
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String orderStatus;
    private String paymentMethod;
}
