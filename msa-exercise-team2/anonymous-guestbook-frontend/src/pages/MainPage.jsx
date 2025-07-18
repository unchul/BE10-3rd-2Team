import React from 'react';
import styled from 'styled-components';
import Introduction from '../components/Introduction';

const Main = () => {
    return (
        <StCotainer>
            <Introduction />
        </StCotainer>
    );
};

export default Main;

const StCotainer = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 50px;
  position: relative;
`;