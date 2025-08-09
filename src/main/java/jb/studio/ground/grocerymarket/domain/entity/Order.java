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
    private Long orderId;
    private Long userId;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String orderStatus; // "pending", "processing", etc.
    private String paymentMethod;
    private Boolean paymentStatus;
    private LocalDateTime updatedAt;
}