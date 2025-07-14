import React, { useState } from 'react';


function GuestbookForm({ onAdd }) {
    const [nickname, setNickname] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nickname || !content) return alert("닉네임과 내용을 모두 입력하세요.");

        await onAdd({ nickname, content });
        setNickname('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
            <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">글 남기기</button>
        </form>
    );
}

export default GuestbookForm;