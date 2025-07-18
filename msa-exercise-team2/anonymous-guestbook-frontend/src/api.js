import axios from 'axios';

// axios 인스턴스 생성 (공통 baseURL 설정)
const api = axios.create({
    baseURL: 'http://localhost:4873',
});
// gateway 단일 url로 넘겨야 하기에 하나로 지정함
// account용 베이스 url
// const aapi = axios.create({
//     baseURL: '/api/account',
// });

// 방명록 목록 가져오기
export const getGuestbookList = () => api.get('/api/guestbook');  // 빈 문자열로 호출

// 글 작성
export const postGuestbook = (data) => api.post('/api/guestbook', data);

// 글 삭제
export const deleteGuestbook = (id, payload) => api.delete(`/api/guestbook/${id}`, {
    data: payload,
});

// 글 수정
export const updateGuestbook = (id, data) => api.put(`/api/guestbook/${id}`, data);


// 회원 가입 관련

// 회원 가입
export const signup = (data) => api.post('/api/account/signup', data);

// 로그인
export const login = (data) => api.post('/api/account/login', data);

// 이메일 중복 체크
export const checkUsernameDuplicate = (username) => api.get('/api/account/checkemail', { params: { username } });

export default api;