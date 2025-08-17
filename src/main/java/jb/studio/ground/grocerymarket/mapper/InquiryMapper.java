// src/main/java/jb/studio/ground/grocerymarket/mapper/InquiryMapper.java
package jb.studio.ground.grocerymarket.mapper;

import jb.studio.ground.grocerymarket.domain.entity.Inquiry;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InquiryMapper {
    List<Inquiry> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);
    Inquiry findById(@Param("id") String id);
    int insert(Inquiry inquiry);
    int updateStatus(@Param("id") String id, @Param("status") String status);
}
