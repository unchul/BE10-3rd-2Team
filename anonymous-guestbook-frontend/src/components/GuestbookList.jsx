import React from 'react';

function GuestbookList({ list }) {
    return (
        <ul>
            {list.map((item) => (
                <li key = {item.id}>
                    <strong>{item.nickname}</strong>
                    ({new Date(item.createdAt).toLocaleString()})
                    <p>{item.content}</p>
                </li>
            ))}
        </ul>
    );
}

export default GuestbookList;