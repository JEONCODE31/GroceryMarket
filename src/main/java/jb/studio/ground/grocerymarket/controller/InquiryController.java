package jb.studio.ground.grocerymarket.controller;

import jb.studio.ground.grocerymarket.domain.entity.Inquiry;
import jb.studio.ground.grocerymarket.domain.entity.Reply;
import jb.studio.ground.grocerymarket.dto.auth.CreateInquiryRequest;
import jb.studio.ground.grocerymarket.dto.auth.CreateReplyRequest;
import jb.studio.ground.grocerymarket.service.InquiryService;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:3000"}, allowCredentials = "true")
public class InquiryController {

    private final InquiryService inquiryService;

    @PermitAll
    @GetMapping("/inquiries")
    public ResponseEntity<List<Inquiry>> list(@RequestParam String userId) {
        return ResponseEntity.ok(inquiryService.listByUser(userId));
    }

    @PermitAll
    @GetMapping("/inquiries/{id}")
    public ResponseEntity<Inquiry> get(@PathVariable String id) {
        return ResponseEntity.ok(inquiryService.get(id));
    }

    @PermitAll
    @PostMapping("/inquiries")
    public ResponseEntity<Inquiry> create(@Valid @RequestBody CreateInquiryRequest req) {
        Inquiry saved = inquiryService.create(req);
        return ResponseEntity.created(URI.create("/api/inquiries/" + saved.getId())).body(saved);
    }

    @PermitAll
    @GetMapping("/inquiries/{id}/replies")
    public ResponseEntity<List<Reply>> replies(@PathVariable String id) {
        return ResponseEntity.ok(inquiryService.listReplies(id));
    }

    @PermitAll
    @PostMapping("/inquiries/{id}/replies")
    public ResponseEntity<Reply> addReply(@PathVariable String id,
                                          @Valid @RequestBody CreateReplyRequest req) {
        Reply saved = inquiryService.addReply(id, req, null);
        return ResponseEntity.created(URI.create("/api/inquiries/" + id + "/replies/" + saved.getId())).body(saved);
    }
}
