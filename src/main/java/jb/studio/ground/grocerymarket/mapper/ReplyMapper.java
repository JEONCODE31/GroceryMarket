// src/main/java/jb/studio/ground/grocerymarket/mapper/ReplyMapper.java
package jb.studio.ground.grocerymarket.mapper;

import jb.studio.ground.grocerymarket.domain.entity.Reply;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReplyMapper {

    // ✅ InquiryService에서 쓰는 메서드 (생성일 오름차순)
    List<Reply> findByInquiryId(@Param("inquiryId") String inquiryId);

    // 기존에 쓰던 이름 유지하고 싶으면 이것도 둬도 됨
    List<Reply> findByInquiryIdOrderByCreatedAtAsc(@Param("inquiryId") String inquiryId);

    int insert(Reply reply);
    Reply findById(@Param("id") String id);
}
