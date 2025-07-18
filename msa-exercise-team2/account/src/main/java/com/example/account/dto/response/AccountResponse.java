package com.example.account.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class AccountResponse {
    private boolean success;
    private String message;
    private LoginResult data;  // 로그인 결과일 때만 값 있음
}
