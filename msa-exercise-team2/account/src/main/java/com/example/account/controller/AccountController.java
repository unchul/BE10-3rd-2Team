package com.example.account.controller;

import com.example.account.dto.request.LoginRequest;
import com.example.account.dto.request.SignupRequest;
import com.example.account.dto.response.AccountResponse;
import com.example.account.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/signup")
    public ResponseEntity<AccountResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(accountService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AccountResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(accountService.login(request));
    }

    @GetMapping("/checkemail")
    public ResponseEntity<AccountResponse> checkEmail(@RequestParam String username) {
        boolean exists = accountService.checkEmailExists(username);
        if (exists) {
            return ResponseEntity.ok(new AccountResponse(false, "이미 존재하는 이메일입니다.", null));
        } else {
            return ResponseEntity.ok(new AccountResponse(true, "사용 가능한 이메일입니다.", null));
        }
    }
}
