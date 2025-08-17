package jb.studio.ground.grocerymarket.mapper;

import jb.studio.ground.grocerymarket.domain.entity.Reply;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReplyMapper {
    List<Reply> findByInquiryIdOrderByCreatedAtAsc(@Param("inquiryId") String inquiryId);
    int insert(Reply reply);

    // ★ 추가: insert 후 재조회용
    Reply findById(@Param("id") String id);
}
