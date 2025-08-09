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
            productMapper.updateProductStock(existingProduct.getProductId(), existingProduct.getStockQuantity());
            System.out.println("기존 상품의 재고를 업데이트했습니다.");
        }
        else{
            productMapper.insertProduct(newProduct);
            System.out.println("새로운 상품을 등록하였습니다.");

        }

    }



}
