package jb.studio.ground.grocerymarket.service;

import jb.studio.ground.grocerymarket.domain.entity.Category;
import jb.studio.ground.grocerymarket.domain.entity.Product;
import jb.studio.ground.grocerymarket.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct; // PostConstruct 임포트 추가

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper productMapper;

    // 카테고리 계층 구조를 메모리에 캐시
    public List<Category> allCategories; // public으로 선언하여 Controller에서 직접 접근 가능하도록
    private Map<Long, List<Long>> categoryHierarchy; // parentId -> List<childIds>, Long 타입으로 변경 반영

    @PostConstruct // 애플리케이션 시작 시 이 메서드 자동 실행
    public void initCategories() {
        allCategories = productMapper.findAllCategories();
        categoryHierarchy = new HashMap<>();
        for (Category category : allCategories) {
            if (category.getParentCategoryId() != null) {
                categoryHierarchy
                    .computeIfAbsent(category.getParentCategoryId(), k -> new ArrayList<>())
                    .add(category.getCategoryId());
            }
        }
        System.out.println("Categories loaded and hierarchy built.");
    }

    // 특정 카테고리와 그 하위 모든 카테고리 ID를 재귀적으로 찾아내는 메서드
    public List<Long> getAllCategoryIdsInHierarchy(Long parentCategoryId) { // Long 타입으로 변경 반영
        if (allCategories == null || categoryHierarchy == null) {
            initCategories(); // 초기화 안되어 있으면 로드
        }

        List<Long> categoryIds = new ArrayList<>();
        categoryIds.add(parentCategoryId); // 시작 카테고리 자신 포함

        // 재귀적으로 자식 카테고리 ID를 추가
        List<Long> children = categoryHierarchy.get(parentCategoryId);
        if (children != null && !children.isEmpty()) {
            for (Long childId : children) { // Long 타입으로 변경 반영
                categoryIds.addAll(getAllCategoryIdsInHierarchy(childId)); // 재귀 호출
            }
        }
        return categoryIds.stream().distinct().collect(Collectors.toList()); // 중복 제거
    }

    // 새로운 메서드: 특정 카테고리 (및 하위) 상품 조회 (페이지네이션 포함)
    public List<Product> getProductsByCategoryId(Long categoryId, int page, int size) { // Long 타입으로 변경 반영
        List<Long> targetCategoryIds = getAllCategoryIdsInHierarchy(categoryId); // 재귀적으로 모든 관련 ID 가져오기

        int offset = (page - 1) * size;
        return productMapper.findProductsByCategoryAndPagination(targetCategoryIds, offset, size);
    }

    // 새로운 메서드: 특정 카테고리 (및 하위) 상품 총 개수 조회
    public int countProductsByCategoryId(Long categoryId) { // Long 타입으로 변경 반영
        List<Long> targetCategoryIds = getAllCategoryIdsInHierarchy(categoryId);
        return productMapper.countProductsByCategory(targetCategoryIds);
    }
} 