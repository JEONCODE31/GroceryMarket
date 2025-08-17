package jb.studio.ground.grocerymarket.service;

import jb.studio.ground.grocerymarket.domain.entity.Inquiry;
import jb.studio.ground.grocerymarket.domain.entity.Reply;
import jb.studio.ground.grocerymarket.dto.auth.CreateInquiryRequest;  // ← 너가 둔 경로 기준
import jb.studio.ground.grocerymarket.dto.auth.CreateReplyRequest;    // ← 동일
import jb.studio.ground.grocerymarket.mapper.InquiryMapper;
import jb.studio.ground.grocerymarket.mapper.ReplyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@Service
public class InquiryService {

    private final InquiryMapper inquiryMapper;
    private final ReplyMapper replyMapper;

    @Transactional(readOnly = true)
    public List<Inquiry> listByUser(String userId) {
        return inquiryMapper.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public Inquiry get(String id) {
        Inquiry i = inquiryMapper.findById(id);
        if (i == null) throw new ResponseStatusException(NOT_FOUND, "Inquiry not found");
        return i;
    }

    @Transactional
    public Inquiry create(CreateInquiryRequest req) {
        Inquiry i = Inquiry.builder()
                .id(UUID.randomUUID().toString())
                .title(req.getTitle())
                .content(req.getContent())
                .userId(req.getUserId())
                .userName(req.getUserName())
                .status("답변 대기")
                .build();

        inquiryMapper.insert(i);

        // DB DEFAULT로 채워진 created_at 반영 위해 재조회하여 반환
        return inquiryMapper.findById(i.getId());
    }

    @Transactional(readOnly = true)
    public List<Reply> listReplies(String inquiryId) {
        return replyMapper.findByInquiryIdOrderByCreatedAtAsc(inquiryId);
    }

    @Transactional
    public Reply addReply(String inquiryId, CreateReplyRequest req) {
        if (inquiryMapper.findById(inquiryId) == null) {
            throw new ResponseStatusException(NOT_FOUND, "Inquiry not found");
        }

        Reply r = Reply.builder()
                .id(UUID.randomUUID().toString())
                .inquiryId(inquiryId)
                .userId(req.getUserId())
                .userName(req.getUserName())
                .content(req.getContent())
                .isUserComment(req.isUserComment())
                .isReplyToAdmin(req.isReplyToAdmin())
                .parentReplyId(req.getParentReplyId())
                .build();

        replyMapper.insert(r);

        if (r.isReplyToAdmin()) {
            inquiryMapper.updateStatus(inquiryId, "답변 완료");
        }

        // Reply도 created_at(DB 기본값) 포함해서 반환
        return replyMapper.findById(r.getId());
    }
}
