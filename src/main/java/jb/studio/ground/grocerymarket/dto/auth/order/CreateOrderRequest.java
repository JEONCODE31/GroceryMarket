package jb.studio.ground.grocerymarket.dto.auth.order;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;

import java.util.List;

@Data
public class CreateOrderRequest {

    // userId는 보통 JWT에서 추출하므로 요청 본문엔 포함되지 않음

    @NotBlank(message = "배송 주소는 필수입니다.")
    private String shippingAddress;

    @NotBlank(message = "결제 방식은 필수입니다.")
    private String paymentMethod;

    @NotNull(message = "주문 상품 목록은 필수입니다.")
    @Valid // 리스트 내부 객체 유효성 검증
    private List<OrderItemRequestDto> items;
}
