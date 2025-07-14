import React, { useEffect, useState } from 'react';
import GuestbookForm from './components/GuestbookForm';
import GuestbookList from './components/GuestbookList';
import { postGuestbook, getGuestbookList } from './api';

function App() {
    const [list, setList] = useState([]);

    // 글 목록 불러오기
    const fetchList = async () => {
        const res = await getGuestbookList();
        setList(res.data);
    };

    useEffect(() => {
        fetchList();
    }, []);

    // 글 작성 핸들러
    const handleAdd = async (data) => {
        await postGuestbook(data);
        fetchList(); // 작성 후 목록 생신
    }

    return (
        <div>
            <h1>🙅‍♀️익명 방명록🙅‍♂️</h1>
            <GuestbookForm onAdd={handleAdd} />
            <GuestbookList list={list} />
        </div>
    );
}

export default App;