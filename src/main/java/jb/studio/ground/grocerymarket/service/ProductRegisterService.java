// src/main/java/jb/studio/ground/grocerymarket/service/ProductRegisterService.java

package jb.studio.ground.grocerymarket.service;

import jb.studio.ground.grocerymarket.domain.entity.Product;
import jb.studio.ground.grocerymarket.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductRegisterService {

    private final ProductMapper productMapper;

    public void registerOrUpdateProduct(Product newProduct) {
        if(newProduct==null || !StringUtils.hasText(newProduct.getProductName())) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }

        Optional<Product> existingProductOpt = productMapper.findByProductName(newProduct.getProductName());

        if(existingProductOpt.isPresent()){
            Product existingProduct = existingProductOpt.get();
            // 기존 상품의 재고를 업데이트하는 로직은 그대로 유지
            productMapper.updateProductStock(existingProduct.getProductId(), existingProduct.getStockQuantity());
            System.out.println("기존 상품의 재고를 업데이트했습니다.");
        }
        else{
            productMapper.insertProduct(newProduct);
            System.out.println("새로운 상품을 등록하였습니다.");
        }
    }

    // 상품 ID로 상품을 조회하는 메서드 추가
    public Product getProductById(Integer productId) {
        return productMapper.findProductById(productId);
    }
}