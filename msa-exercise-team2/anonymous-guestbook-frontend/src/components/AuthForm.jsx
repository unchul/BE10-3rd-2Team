import React, { useState } from "react";
import styled from "styled-components";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { checkUsernameDuplicate, signup, login } from "../api";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(null); // null | true | false

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (id === "email") {
      setIsEmailValid(null); // 이메일 변경 시 상태 초기화
    }
  };

  const handleReset = () => {
    setForm({ email: "", password: "", repeatPassword: "" });
    setIsEmailValid(null);
  };

  const handleCheckEmail = async () => {
    if (!form.email) {
      alert("이메일을 입력하세요.");
      return;
    }
    try {
      // 백엔드에는 'username'으로 전달하기 위해 form.email 값을 넘깁니다.
      const res = await checkUsernameDuplicate(form.email);
      if (res.data.success === true) {
        alert(res.data.message);
        setIsEmailValid(true);
      } else {
        alert(res.data.message);
        setIsEmailValid(false);
      }
    } catch (err) {
      console.error("중복 확인 실패:", err);
      alert("중복 확인 실패: 서버와 통신할 수 없거나 예상치 못한 오류가 발생했습니다.");
      setIsEmailValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "signup") {
      if (!isEmailValid) {
        return alert("이메일 중복 확인이 필요합니다.");
      }
      if (form.password !== form.repeatPassword) {
        return alert("비밀번호가 일치하지 않습니다.");
      }

      try {
        await signup({
          username: form.email, // 백엔드에는 'username'으로 매핑하여 보냄
          password: form.password,
        });
        alert("회원가입 성공! 로그인 해보세요.");
        handleReset();
        setMode("signin");
      } catch (err) {
        console.error("회원가입 실패:", err);
        alert("회원가입 실패.");
      }
    } else {
      try {
        const res = await login({
          username: form.email, // 백엔드에는 'username'으로 매핑하여 보냄
          password: form.password,
        });

        if (res.data.success === true) {
          const { data } = res.data;

          // --- 수정된 부분 시작 ---
          // accessToken 대신 백엔드에서 제공하는 user 정보 사용
          if (data && data.uuid && data.id && data.userEmail) {
            // 백엔드에서 직접적인 accessToken을 주지 않는다면
            // userId와 userEmail을 저장하여 인증 상태를 관리할 수 있습니다.
            // 필요하다면 UUID도 저장할 수 있습니다.
            localStorage.setItem('userId', data.id);
            localStorage.setItem('userEmail', data.userEmail); // userEmail 저장
            localStorage.setItem('accessToken', data.uuid);
            // 백엔드에서 accessToken을 주지 않는 경우,
            // 별도의 세션 관리나 토큰 발급 로직이 필요할 수 있습니다.
            // 여기서는 userEmail과 userId만으로 로그인 상태를 가정합니다.
            alert("로그인 성공!");
            navigate('/');
          } else {
            console.error("로그인 성공 응답이지만 필수 정보가 없습니다 (id, userEmail):", res.data);
            alert("로그인 실패: 서버 응답 형식이 올바르지 않습니다.");
          }
        } else {
          alert("로그인 실패: " + res.data.message);
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('accessToken');

        }
        // --- 수정된 부분 끝 ---

      } catch (err) {
        console.error("로그인 요청 실패:", err);
        alert("로그인 실패: 서버와 통신할 수 없거나 예상치 못한 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Container>
      <Title>{mode === "signin" ? "SIGN IN" : "SIGN UP"}</Title>

      <ToggleGroup>
        <ToggleButton
          active={mode === "signin"}
          onClick={() => setMode("signin")}
          type="button"
        >
          SIGN IN
        </ToggleButton>
        <ToggleButton
          active={mode === "signup"}
          onClick={() => setMode("signup")}
          type="button"
        >
          SIGN UP
        </ToggleButton>
        <ResetButton onClick={handleReset} type="button">
          RESET
        </ResetButton>
      </ToggleGroup>

      <Form onSubmit={handleSubmit}>
        <InputBlock>
          <Input
            type="email"
            placeholder="Email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {mode === "signup" && (
            <CheckButton type="button" onClick={handleCheckEmail}>
              중복 확인
            </CheckButton>
          )}
        </InputBlock>

        <InputBlock>
          <Input
            type="password"
            placeholder="Password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </InputBlock>

        {mode === "signup" && (
          <InputBlock>
            <Input
              type="password"
              placeholder="Repeat password"
              id="repeatPassword"
              value={form.repeatPassword}
              onChange={handleChange}
              required
            />
          </InputBlock>
        )}

        <SubmitButton type="submit">
          {mode === "signin" ? "Sign in" : "Sign up"}
        </SubmitButton>
      </Form>

      <Separator>
        <p>OR</p>
      </Separator>
      <SocialContainer>
        <SocialButton google>
          <FaGoogle />
          Sign in with Google
        </SocialButton>
        <SocialButton github>
          <FaGithub />
          Sign in with GitHub
        </SocialButton>
      </SocialContainer>
    </Container>
  );
};

export default AuthForm;

const Container = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 3rem auto;
  padding: 2rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
  background: radial-gradient(
    circle at center,
    #ffffff 0%,
    #f9f9f9 70%,
    #eeeeee 100%
  );
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 900;
  color: #ff0000;
  letter-spacing: 0.1em;
`;

const ToggleGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1.8rem;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 0.7rem;
  cursor: pointer;
  border: 2px solid #007bff;
  background-color: ${({ active }) => (active ? "#007bff" : "transparent")};
  color: ${({ active }) => (active ? "white" : "#007bff")};
  box-shadow: ${({ active }) =>
    active ? "0 6px 12px rgba(0,123,255,0.4)" : "none"};
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    color: white;
    box-shadow: 0 6px 12px rgba(0, 86, 179, 0.5);
  }
`;

const ResetButton = styled.button`
  margin-left: auto;
  padding: 0.65rem 1rem;
  background-color: #6c757d;
  border-radius: 0.7rem;
  font-weight: 600;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  border: 1.5px solid #ccc;
  border-radius: 0.6rem;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const CheckButton = styled.button`
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background-color: #6c757d;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 0;
  font-size: 1.2rem;
  font-weight: 900;
  color: white;
  background: linear-gradient(90deg, #007bff, #0056b3);
  border: none;
  border-radius: 0.8rem;
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(0, 123, 255, 0.5);
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #0056b3, #003d7a);
  }
`;

const Separator = styled.div`
  text-align: center;
  margin: 2rem 0 1.5rem;
  font-weight: 900;
  font-size: 1.1rem;
  color: #999;
  position: relative;

  p {
    background-color: #fff;
    display: inline-block;
    padding: 0 1rem;
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 1.5rem;
    right: 1.5rem;
    height: 1px;
    background: #ddd;
    z-index: 0;
  }
`;

const SocialContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.85rem 1rem;
  width: 100%;
  border: none;
  border-radius: 0.7rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  background-color: ${({ google, github }) =>
    google ? "#DB4437" : github ? "#24292e" : "#6c757d"};

  &:hover {
    background-color: ${({ google, github }) =>
      google ? "#b33629" : github ? "#171a1d" : "#5a6268"};
  }

  svg {
    font-size: 1.3rem;
  }
`;
