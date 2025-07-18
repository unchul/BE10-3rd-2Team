package com.example.account.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class LoginResult {
    private String uuid;
    private Long id;
    private String userEmail;
}
