import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

function GuestbookForm({ onAdd }) {
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(''); // userId 상태 추가


  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserId && storedUserEmail) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserEmail(storedUserEmail);
    } else {
      setIsLoggedIn(false);
      setUserId('');
      setUserEmail('');
    }
  }, []); // 빈 배열로 한 번만 실행

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newEntry;
    if (isLoggedIn) {
      if (!content) return alert("내용을 입력해 주세요.");
      // 백엔드의 Guestbook 엔티티에 'email' 필드가 없으므로,
      // userEmail을 nickname으로 보내고 userId도 함께 보냅니다.
      newEntry = { content, nickname: userEmail, userId: parseInt(userId) };
    } else {
      if (!nickname || !content || !password) return alert("모두 입력해 주세요.");
      newEntry = { nickname, content, password };
    }

    await onAdd(newEntry);

    // 작성 후 폼 초기화
    setContent('');
    if (!isLoggedIn) {
      setNickname('');
      setPassword('');
    }
    // 로그인 상태에서는 닉네임과 비밀번호 필드가 없으므로 초기화할 필요 없음
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {isLoggedIn ? (
        <LoggedInInfo>작성자: {userEmail}</LoggedInInfo>
      ) : (
        <>
          <Input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호 (삭제/수정 시 필요)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </>
      )}

      <Textarea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <SubmitButton type="submit">글 남기기</SubmitButton>
    </FormContainer>
  );
}

export default GuestbookForm;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border-bottom: 1px solid #ccc;
  min-width: 500px;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 0.4rem;
  border: 1px solid #ccc;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border-radius: 0.4rem;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoggedInInfo = styled.div`
  padding: 0.75rem;
  background-color: #e9ecef;
  border-radius: 0.4rem;
  font-size: 1rem;
  color: #333;
  font-weight: bold;
`;