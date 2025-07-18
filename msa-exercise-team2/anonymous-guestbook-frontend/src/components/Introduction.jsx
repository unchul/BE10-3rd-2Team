import { useNavigate } from "react-router-dom";
import {
    Cursor,
    useTypewriter,
    TypewriterHelper,
} from "react-simple-typewriter";
import styled from "styled-components";



const Introduction = () => {
    const navigate = useNavigate();

    const navigateguest = () => {
        navigate("/guestbookpage")

    }
    const words = [
        "아주 난폭한 오리인",
        "참새를 물어 뜯는데 특화된",
        "나는 지금 아무것도 하고 싶지 않은",
        "왜냐하면 아무것도 하고 싶지 않기 때문인",
    ];
    const [text] = useTypewriter({
        words,
        loop: 0,
    });
    return (
        <>
            <StCotainer onClick={navigateguest}>

                <StContent>
                    저는
                    <br />
                    <span>{text}</span>
                    <Cursor />
                    <br />
                    개발자가 되고싶습니다.
                </StContent>
            </StCotainer>
        </>
    )
}


export default Introduction;

const StCotainer = styled.section`
    width: auto;
    height: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
  `;

const StContent = styled.div`
    font-size: 60px;
    font-weight: bold;
    color: black;
  `;