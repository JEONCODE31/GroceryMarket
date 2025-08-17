// src/main/java/jb/studio/ground/grocerymarket/service/InquiryService.java
package jb.studio.ground.grocerymarket.service;

import jb.studio.ground.grocerymarket.domain.entity.Inquiry;
import jb.studio.ground.grocerymarket.domain.entity.Reply;
import jb.studio.ground.grocerymarket.dto.auth.CreateInquiryRequest;
import jb.studio.ground.grocerymarket.dto.auth.CreateReplyRequest;
import jb.studio.ground.grocerymarket.mapper.InquiryMapper;
import jb.studio.ground.grocerymarket.mapper.ReplyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryMapper inquiryMapper;
    private final ReplyMapper replyMapper;

    public List<Inquiry> listByUser(String userId) {
        return inquiryMapper.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Inquiry get(String id) {
        return inquiryMapper.findById(id);
    }

    @Transactional
    public Inquiry create(CreateInquiryRequest req) {
        Inquiry inq = new Inquiry();
        inq.setId(UUID.randomUUID().toString());
        inq.setTitle(req.getTitle());
        inq.setContent(req.getContent());
        inq.setUserId(req.getUserId());
        inq.setUserName(req.getUserName());
        inq.setStatus("답변 대기");

        // DTO에 파일 필드가 있으면만 세팅(없으면 두 줄 지워도 됨)
        if (req.getFileUrl() != null)  inq.setFileUrl(req.getFileUrl());
        if (req.getFileName() != null) inq.setFileName(req.getFileName());

        inquiryMapper.insert(inq);
        return inq;
    }

    public List<Reply> listReplies(String inquiryId) {
        // 네 XML에 있는 쿼리 id에 맞춤
        return replyMapper.findByInquiryIdOrderByCreatedAtAsc(inquiryId);
    }

    @Transactional
    public Reply addReply(String inquiryId, CreateReplyRequest req, String currentUserEmailOrId) {
        Inquiry inq = inquiryMapper.findById(inquiryId);   // 이미 조회하고 있더라구요

        Reply r = new Reply();
        r.setId(UUID.randomUUID().toString());
        r.setInquiryId(inquiryId);

        // ✅ 문의 소유자 정보로 고정
        r.setUserId(inq.getUserId());
        r.setUserName(inq.getUserName());

        r.setContent(req.getContent());

        // ✅ 사용자가 단 댓글인지
        r.setUserComment(req.isUserComment());

        // ✅ 관리자에게 답변하는 댓글인지 (사용자 댓글이면 true, 관리자가 쓰면 false)
        r.setReplyToAdmin(req.isUserComment());

        // ✅ 실제 작성자(없으면 로그인 사용자로)
        r.setAuthorId(
                (req.getAuthorId() != null && !req.getAuthorId().isBlank())
                        ? req.getAuthorId()
                        : currentUserEmailOrId
        );
        r.setAuthorName(req.getAuthorName()); // 필요시 기본값 "관리자" 등 세팅 고려

        replyMapper.insert(r);

        if (!r.isUserComment()) {
            inquiryMapper.updateStatus(inquiryId, "답변 완료");
        }
        return replyMapper.findById(r.getId());
    }
}
