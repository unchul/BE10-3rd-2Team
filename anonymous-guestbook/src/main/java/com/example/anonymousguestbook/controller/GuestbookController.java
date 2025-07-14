package com.example.anonymousguestbook.controller;

import com.example.anonymousguestbook.entity.Guestbook;
import com.example.anonymousguestbook.repository.GuestbookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/guestbook")
@RequiredArgsConstructor
public class GuestbookController {

    private final GuestbookRepository guestbookRepository;

    // 글 작성
    @PostMapping
    public Guestbook create(@RequestBody Guestbook guestbook) {
        return guestbookRepository.save(guestbook);
    }

    // 글 전제 조회
    @GetMapping
    public List<Guestbook> getAll() {
        // 전체 글을 조회 후 최신 순으로 정렬 후 반환
        return guestbookRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }
}
