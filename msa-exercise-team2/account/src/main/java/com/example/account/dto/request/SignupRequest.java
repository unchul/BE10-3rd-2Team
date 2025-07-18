package com.example.account.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignupRequest {
    private String username;  // 이메일
    private String password;
}
