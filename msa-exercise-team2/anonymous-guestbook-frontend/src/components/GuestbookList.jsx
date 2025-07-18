import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

function GuestbookList({ list, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editNickname, setEditNickname] = useState(''); // 비회원 닉네임 수정용
  const [editingPassword, setEditingPassword] = useState(''); // 비회원 비밀번호 수정용
  const [isLoggedIn, setIsLoggedIn] = useState(false); // GuestbookPage에서 props로 받도록 변경
  const [currentUserId, setCurrentUserId] = useState(null); // 현재 로그인한 userId

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    if (userId && userEmail) {
      setIsLoggedIn(true);
      setCurrentUserId(parseInt(userId)); // userId를 숫자로 저장
    } else {
      setIsLoggedIn(false);
      setCurrentUserId(null);
    }
  }, []); // 빈 배열로 한 번만 실행

  // item.userId가 현재 로그인한 userId와 일치하는지 확인하는 헬퍼 함수
  const isAuthor = (itemUserId) => {
    return isLoggedIn && itemUserId === currentUserId;
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditContent(item.content);
    // 로그인한 사용자의 글이면 닉네임은 변경 불가 (표시용)
    // 비회원의 글이면 닉네임 수정 가능하도록 현재 닉네임 로드
    if (isLoggedIn) {
      // 로그인한 사용자의 글을 수정하는 경우, 닉네임은 userEmail을 따르므로 편집 필드를 숨기거나 readOnly 처리
      // 이 부분은 UI에 따라 다름. 여기서는 nickname 필드를 빈 값으로 두어 표시하지 않거나 readOnly 처리 가능.
      setEditNickname(item.nickname); // DB에 저장된 nickname(userEmail)을 불러옴
    } else {
      setEditNickname(item.nickname);
      setEditingPassword(''); // 비밀번호 입력 필드 초기화
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditNickname('');
    setEditingPassword('');
  };

  const handleUpdateSubmit = async (id) => {
    let updatedData = { content: editContent };

    if (isLoggedIn) {
      // 로그인된 사용자: userId만 함께 보냄
      updatedData.userId = currentUserId;
    } else {
      // 비로그인 사용자: 닉네임과 비밀번호 확인
      if (!editNickname || !editingPassword) {
        alert("닉네임과 비밀번호를 모두 입력해야 합니다.");
        return;
      }
      updatedData.nickname = editNickname;
      updatedData.password = editingPassword;
    }

    await onUpdate(id, updatedData);
    cancelEdit();
  };

  const handleDeleteClick = async (id, itemUserId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    let payload;

    if (isLoggedIn) {
      // 로그인된 사용자: userId만 payload에 담아서 보냄
      payload = { userId: currentUserId.toString() }; // 백엔드 Map<String, String>에 맞춰 String으로 변환
    } else {
      // 비로그인 사용자: 비밀번호를 prompt로 입력받아 payload에 담음
      const password = prompt("비밀번호를 입력하세요.");
      if (!password) return; // 비밀번호 입력 취소 시 삭제 중단
      payload = { password };
    }

    await onDelete(id, payload);
  };

  return (
    <List>
      {list.map(item => (
        <Card key={item.id}>
          {editingId === item.id ? (
            <>
              {isLoggedIn ? (
                // 로그인 상태일 때는 작성자가 현재 로그인한 사용자일 경우에만 수정 가능
                isAuthor(item.userId) ? (
                  <>
                    <Input type="text" value={item.nickname || item.email} readOnly disabled /> {/* DB에 저장된 닉네임 (즉, email) 표시 */}
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="내용"
                    />
                  </>
                ) : (
                  <Content>다른 사용자의 글은 수정할 수 없습니다.</Content> // 다른 사용자의 글
                )
              ) : (
                // 비로그인 상태일 때 수정 폼
                <>
                  <Input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    placeholder="닉네임"
                  />
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="내용"
                  />
                  <Input
                    type="password"
                    value={editingPassword}
                    onChange={(e) => setEditingPassword(e.target.value)}
                    placeholder="비밀번호 (수정 시 필요)"
                  />
                </>
              )}

              <ButtonGroup>
                {/* 로그인 상태에서 본인 글이거나 비로그인 상태일 때만 저장 버튼 활성화 */}
                {(isLoggedIn && isAuthor(item.userId)) || !isLoggedIn ? (
                  <Button onClick={() => handleUpdateSubmit(item.id)}>저장</Button>
                ) : null}
                <CancelButton onClick={cancelEdit}>취소</CancelButton>
              </ButtonGroup>
            </>
          ) : (
            // 일반 보기 모드
            <>
              <Nickname>
                {/* userId가 있으면 회원, 없으면 비회원. 회원의 닉네임은 userEmail로 표시 */}
                {item.userId ? item.nickname : item.nickname}
                {item.userId && isAuthor(item.userId) && <AuthorBadge> (나)</AuthorBadge>}
              </Nickname>
              <Content>{item.content}</Content>
              <ButtonGroup>
                {/* 수정/삭제 버튼은 본인 글이거나 비회원 글일 때만 표시 */}
                {(isLoggedIn && isAuthor(item.userId)) || (!isLoggedIn && item.userId === null) ? (
                  <>
                    <Button onClick={() => startEdit(item)}>수정</Button>
                    <DeleteButton onClick={() => handleDeleteClick(item.id, item.userId)}>삭제</DeleteButton>
                  </>
                ) : (
                  <Button disabled>권한 없음</Button> // 다른 사용자의 글
                )}
              </ButtonGroup>
            </>
          )}
        </Card>
      ))}
    </List>
  );
}

export default GuestbookList;

const AuthorBadge = styled.span` /* 추가 */
  margin-left: 8px;
  padding: 2px 8px;
  background-color: #6a5af9;
  color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: normal;
`;

const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem auto;
  min-width: 500px;
  max-width: 800px;
`;

const Card = styled.li`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.12);
  border: 3px solid;
  border-image: linear-gradient(135deg, #f9b937, #e25858) 1;
  transition: transform 0.3s ease;
  will-change: transform;

  &:hover {
    animation: ${shake} 0.4s ease-in-out;
  }
`;

const Nickname = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #444;
  margin-bottom: 0.6rem;
  border-left: 4px solid #6a5af9;
  padding-left: 0.5rem;
`;

const Content = styled.p`
  margin: 0;
  color: #333;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #ddd;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 0.6rem;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: #6a5af9;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5848e5;
  }
`;

const CancelButton = styled(Button)`
  background-color: #aaa;

  &:hover {
    background-color: #888;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff5e5e;

  &:hover {
    background-color: #e04848;
  }
`;