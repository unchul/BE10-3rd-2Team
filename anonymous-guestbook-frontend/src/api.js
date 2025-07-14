import axios from 'axios';

// axios 인스턴스 생성 (공통 baseURL 설정)
const api = axios.create({
    baseURL: '/api/guestbook',  // 상대경로로 변경
});

// 방명록 목록 가져오기
export const getGuestbookList = () => api.get('');  // 빈 문자열로 호출
export const postGuestbook = (data) => api.post('', data);

export default api;