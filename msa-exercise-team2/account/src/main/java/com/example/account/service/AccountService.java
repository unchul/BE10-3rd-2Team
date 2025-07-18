package com.example.account.service;

import com.example.account.dto.request.LoginRequest;
import com.example.account.dto.request.SignupRequest;
import com.example.account.dto.response.AccountResponse;
import com.example.account.dto.response.LoginResult;
import com.example.account.entity.User;
import com.example.account.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {
    private static final Logger log = LoggerFactory.getLogger(AccountService.class); // 로거 선언

    private final UserRepository userRepository;

    public AccountResponse signup(SignupRequest request) {
        log.info("회원가입 요청 - 이메일: {}", request.getUsername()); // 요청 이메일 로그


        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("회원가입 실패 - 이미 존재하는 이메일: {}", request.getUsername()); // 실패 로그

            return new AccountResponse(false, "이미 존재하는 이메일입니다.", null);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());  // 평문 저장
        userRepository.save(user);

        log.info("회원가입 성공 - 이메일: {}", request.getUsername()); // 성공 로그

        return new AccountResponse(true, "회원가입 성공", null);
    }

    public AccountResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            return new AccountResponse(false, "아이디 또는 비밀번호가 올바르지 않습니다.", null);
        }

        if (!request.getPassword().equals(user.getPassword())) {
            return new AccountResponse(false, "아이디 또는 비밀번호가 올바르지 않습니다.", null);
        }

        String uuid = UUID.randomUUID().toString();
        LoginResult result = new LoginResult(uuid, user.getId(), user.getUsername());

        return new AccountResponse(true, "로그인 성공", result);
    }

    public boolean checkEmailExists(String username) {
        return userRepository.existsByUsername(username);
    }
}
