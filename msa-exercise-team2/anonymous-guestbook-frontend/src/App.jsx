import React, { useEffect, useState } from 'react';
import { postGuestbook, getGuestbookList } from './api';
import styled from 'styled-components';
import GuestbookPage from './pages/GuestbookPage';
import AuthForm from "./components/AuthForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';

function App() {

    return (



        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="guestbookpage" element={<GuestbookPage />} />
                <Route path="loginpage" element={<LoginPage/>}/>
            </Routes>
        </BrowserRouter>

    );
}

export default App;
