package jb.studio.ground.grocerymarket.dto.auth.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {
    // productId 타입을 Long에서 Integer로 변경하여 모든 엔티티와 일치시킴
    @NotNull(message = "상품 ID는 필수입니다.")
    private Integer productId;

    @NotNull(message = "수량은 필수입니다.")
    @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
    private Integer quantity;
}
