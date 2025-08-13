// src/main/java/jb/studio/ground/grocerymarket/controller/ProductRegisterController.java

package jb.studio.ground.grocerymarket.controller;

import jb.studio.ground.grocerymarket.domain.entity.Product;
import jb.studio.ground.grocerymarket.service.ProductRegisterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // MultipartFile 임포트
import jakarta.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ProductRegisterController {

    private final ProductRegisterService productRegisterService;
    private final String uploadDir = "C:/Users/Mycom/Desktop/식자재마트/";

    public ProductRegisterController(ProductRegisterService productRegisterService) {
        this.productRegisterService = productRegisterService;
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            System.err.println("Error creating upload directory: " + e.getMessage());
        }
    }

    // 상품 등록/수정 API (기존 로직 유지)
    @PostMapping("/productregister")
    public ResponseEntity<String> registerOrUpdateProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            HttpServletRequest request
    ) {
        // ... (기존 메서드 내용 유지) ...
        Product product;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            product = objectMapper.readValue(productJson, Product.class);
        } catch (IOException e) {
            return new ResponseEntity<>("Invalid product JSON data: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        try {
            // ... (상품 필수 필드 검증 및 이미지 업로드 로직 유지) ...
            if (product.getProductName() == null || product.getProductName().trim().isEmpty()) {
                return new ResponseEntity<>("Product name is required", HttpStatus.BAD_REQUEST);
            }
            if (product.getCategoryId() == null) {
                return new ResponseEntity<>("Category ID is required", HttpStatus.BAD_REQUEST);
            }
            if (product.getPrice() == null) {
                return new ResponseEntity<>("Price is required", HttpStatus.BAD_REQUEST);
            }
            if (product.getStockQuantity() == null) {
                product.setStockQuantity(0);
            }
            if (product.getIsActive() == null) {
                product.setIsActive(true);
            }
            if (product.getProductDescription() == null) {
                product.setProductDescription("");
            }

            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    String originalFilename = imageFile.getOriginalFilename();
                    String fileExtension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }
                    String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
                    Path filePath = Paths.get(uploadDir + uniqueFileName);
                    Files.copy(imageFile.getInputStream(), filePath);
                    String imageUrl = "/uploads/" + uniqueFileName;
                    product.setImageUrl(imageUrl);
                    System.out.println("Image saved to: " + imageUrl);
                } catch (IOException e) {
                    System.err.println("Failed to upload image: " + e.getMessage());
                    return new ResponseEntity<>("Failed to upload image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            productRegisterService.registerOrUpdateProduct(product);
            return new ResponseEntity<>("Product processed successfully (registered or updated).", HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An internal server error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 상품 상세 조회 API 추가
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable("productId") Integer productId) {
        try {
            Product product = productRegisterService.getProductById(productId);
            if (product == null) {
                return new ResponseEntity<>("Product not found with ID: " + productId, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error retrieving product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}