package com.example.anonymousguestbook.controller;

import com.example.anonymousguestbook.entity.Guestbook;
import com.example.anonymousguestbook.repository.GuestbookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/guestbook")
@RequiredArgsConstructor
public class GuestbookController {

    private final GuestbookRepository guestbookRepository;

    // 글 작성
    @PostMapping
    public Guestbook create(@RequestBody Guestbook guestbook) {

        if (guestbook.getUserId() != null) {
            guestbook.setPassword("");
        }
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

    // 글 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateGuestbook(@PathVariable Long id, @RequestBody Guestbook updateGuestbook) {
        Optional<Guestbook> optionalGuestbook = guestbookRepository.findById(id);

        if (optionalGuestbook.isPresent()) {
            Guestbook existing = optionalGuestbook.get();

            if (updateGuestbook.getUserId() != null) {
                // 회원이면 User 프라이머리 값 비교입니두
                if (!updateGuestbook.getUserId().equals(existing.getUserId())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("권한이 없습니다");
                }
                existing.setContent(updateGuestbook.getContent());

            } else {
                // 비회원이면 태준이형이 비밀번호 체크 후 줘팹니다.
                if (existing.getPassword() == null || updateGuestbook.getPassword() == null || !existing.getPassword().equals(updateGuestbook.getPassword())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
                }
                existing.setContent(updateGuestbook.getContent());
                existing.setNickname(updateGuestbook.getNickname());
            }


            guestbookRepository.save(existing);
            return ResponseEntity.ok("수정 성공");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // 글 삭제
    @DeleteMapping("{id}")
    // 결국 정신 건강을 포기하지 못하고 죽어가는 오리
    public ResponseEntity<String> deleteGuestbook(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<Guestbook> optional = guestbookRepository.findById(id);
        if (optional.isPresent()) {
            Guestbook guestbook = optional.get();

            String userIdStr = request.get("userId"); // userId를 String으로 받음
            if (userIdStr != null && !userIdStr.isEmpty()) { // userId가 있다면 회원
                Long userId = Long.valueOf(userIdStr);
                if (!userId.equals(guestbook.getUserId())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("권한이 없습니다");
                }
            } else { // userId가 없다면 비회원 (비밀번호 확인)
                String password = request.get("password");
                if (guestbook.getPassword() == null || !guestbook.getPassword().equals(password)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다");
                }
            }


            guestbookRepository.deleteById(id);
            return ResponseEntity.ok("삭제 성공");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 ID의 방명록이 없습니다.");
    }
}