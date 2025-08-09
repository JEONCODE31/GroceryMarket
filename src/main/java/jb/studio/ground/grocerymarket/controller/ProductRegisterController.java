package jb.studio.ground.grocerymarket.controller;

import jb.studio.ground.grocerymarket.domain.entity.Product;
import jb.studio.ground.grocerymarket.service.ProductRegisterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart; // RequestPart 임포트
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile; // MultipartFile 임포트
import jakarta.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.databind.ObjectMapper; // ObjectMapper 임포트 (JSON String을 Product 객체로 변환용)

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID; // 고유한 파일 이름 생성을 위한 UUID 임포트

@RestController
public class ProductRegisterController {

    private final ProductRegisterService productRegisterService;
    // 이미지 파일 저장 기본 경로 (실제 프로덕션에서는 외부 설정 파일로 관리하는 것이 좋음)
    private final String uploadDir = "C:/Users/Mycom/Desktop/식자재마트/";

    public ProductRegisterController(ProductRegisterService productRegisterService) {
        this.productRegisterService = productRegisterService;
        // 업로드 디렉토리가 없으면 생성 (애플리케이션 시작 시 한 번만 실행)
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            System.err.println("Error creating upload directory: " + e.getMessage());
        }
    }

    // 상품 등록/수정 API - JSON 데이터와 파일 데이터를 함께 받음 (multipart/form-data)
    @PostMapping("/productregister")
    public ResponseEntity<String> registerOrUpdateProduct(
            @RequestPart("product") String productJson, // JSON 데이터를 String으로 받음
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile, // 이미지 파일 (필수 아님)
            HttpServletRequest request
    ) {
        System.out.println("Authorization Header: " + request.getHeader("Authorization"));
        System.out.println("Request URL: " + request.getRequestURI());
        System.out.println("Request Method: " + request.getMethod());

        Product product;
        try {
            // JSON String을 Product 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            product = objectMapper.readValue(productJson, Product.class);
        } catch (IOException e) {
            return new ResponseEntity<>("Invalid product JSON data: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        try {
            // 필수 필드 검증 (기존 로직 유지)
            if (product.getProductName() == null || product.getProductName().trim().isEmpty()) {
                return new ResponseEntity<>("Product name is required", HttpStatus.BAD_REQUEST);
            }
            if (product.getCategoryId() == null) {
                return new ResponseEntity<>("Category ID is required", HttpStatus.BAD_REQUEST);
            }
            if (product.getPrice() == null) {
                return new ResponseEntity<>("Price is required", HttpStatus.BAD_REQUEST);
            }
            // ... (기타 필드 기본값 설정 로직 유지) ...
            if (product.getStockQuantity() == null) {
                product.setStockQuantity(0); // 기본값 설정
            }
            if (product.getIsActive() == null) {
                product.setIsActive(true); // 기본값 설정
            }
            if (product.getProductDescription() == null) {
                product.setProductDescription(""); // 기본값 설정
            }

            // 이미지 파일 처리 로직 추가
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    // 고유한 파일 이름 생성
                    String originalFilename = imageFile.getOriginalFilename();
                    String fileExtension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }
                    String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
                    Path filePath = Paths.get(uploadDir + uniqueFileName);

                    // 파일 저장
                    Files.copy(imageFile.getInputStream(), filePath);

                    // 저장된 이미지의 URL 설정 (예: /uploads/products/xyz.jpg)
                    // 실제 서비스에서는 이 URL이 프론트엔드에서 접근 가능한 형태로 구성되어야 합니다.
                    // (예: Nginx 설정 또는 Spring Boot의 static resources 설정)
                    String imageUrl = "/uploads/" + uniqueFileName;
                    product.setImageUrl(imageUrl); // Product 객체에 imageUrl 설정

                    System.out.println("Image saved to: " + imageUrl);

                } catch (IOException e) {
                    System.err.println("Failed to upload image: " + e.getMessage());
                    return new ResponseEntity<>("Failed to upload image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } else {
                // 이미지가 업로드되지 않은 경우, 기존 imageUrl을 유지하거나 null로 설정 (업데이트 시 고려)
                // 신규 등록의 경우 null, 업데이트 시에는 기존 이미지 URL이 전달되지 않으면 null로 덮어씌워질 수 있음
                // 이 부분은 비즈니스 로직에 따라 처리해야 합니다.
                // product.setImageUrl(null); // 만약 이미지가 없으면 null로 강제 설정 (신규 등록의 경우)
            }

            productRegisterService.registerOrUpdateProduct(product);

            return new ResponseEntity<>("Product processed successfully (registered or updated).", HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An internal server error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}