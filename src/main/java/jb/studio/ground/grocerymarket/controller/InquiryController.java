package jb.studio.ground.grocerymarket.controller;

import jb.studio.ground.grocerymarket.domain.entity.Inquiry;
import jb.studio.ground.grocerymarket.domain.entity.Reply;
import jb.studio.ground.grocerymarket.dto.auth.CreateInquiryRequest;
import jb.studio.ground.grocerymarket.dto.auth.CreateInquiryRequest;
import jb.studio.ground.grocerymarket.dto.auth.CreateReplyRequest;
import jb.studio.ground.grocerymarket.service.InquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class InquiryController {

    private final InquiryService inquiryService;

    @GetMapping("/inquiries")
    public ResponseEntity<List<Inquiry>>list(@RequestParam String userId)
    {
        return ResponseEntity.ok(inquiryService.listByUser(userId));
    }

    @GetMapping("/inquiries/{id}")
    public ResponseEntity<Inquiry> get(@PathVariable String id)
    {
        return ResponseEntity.ok(inquiryService.get(id));
    }

    @PostMapping("/inquiries")
    public ResponseEntity<Inquiry> create(@Valid @RequestBody CreateInquiryRequest req) {
        Inquiry saved = inquiryService.create(req);
        return ResponseEntity.created(URI.create("/api/inquiries/" + saved.getId())).body(saved);
    }

    @GetMapping("/inquiries/{id}/replies")
    public ResponseEntity<List<Reply>>replies(@PathVariable String id) {
        return ResponseEntity.ok(inquiryService.listReplies(id));
    }

}
