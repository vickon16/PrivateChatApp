/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import { flexCenter, formatDate } from "../globalFunctions";
import { Link } from "react-router-dom";
import { useChat } from "../context/chatContext";

const SelectedUserProfile = () => {
  const { state: { selectedUser }} = useChat();

  return (
    <Wrapper>
      <Container>
        {!selectedUser ? (
          <>
            <Content>
              <h3>There is no user selected for this page</h3>
            </Content>
            <article className="button-wrapper">
              <Link to="/" className="btn">
                Back to Home
              </Link>
            </article>
          </>
        ) : (
          <>
            <article className="img-container">
              <img src={selectedUser.image?.url || "/user-icon.png"} alt="profile-img" />
            </article>
            <Content>
              <h3>{selectedUser.name}</h3>
              <p>{selectedUser.email}</p>
              <hr />
              <small>
                Joined on <b>{formatDate(selectedUser.createdAt)}</b>
              </small>
            </Content>
            <article className="button-wrapper">
              <Link to="/" className="btn">
                Back to Home
              </Link>
            </article>
          </>
        )}
      </Container>
    </Wrapper>
  );
};

export default SelectedUserProfile;

const Wrapper = styled.section`
  width: 100%;
`;
const Container = styled.div`
  width: min(100%, 550px);
  margin: 0 auto;
  box-shadow: var(--shadow);
  padding: 35px 20px;
  ${flexCenter("", "", "flex-start")};
  gap: 30px 20px;
  user-select: none;
  flex-wrap: wrap;

  .img-container {
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    border-radius: 50%;
    border: 2px solid var(--color4-Gray);

    .overlay {
      position: absolute;
      background-color: var(--color1-Bg);
      opacity: 0;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      ${flexCenter("center")};
      cursor: pointer;
      transition: 0.35s ease-in-out;

      svg {
        width: 40px;
        height: 40px;
        opacity: 0;
        transition: 0.35s ease-in-out;
      }
    }

    img {
      height: 100%;
    }

    &:hover {
      .overlay {
        opacity: 0.6;

        svg {
          opacity: 1;
        }
      }
    }
  }

  .button-wrapper {
    width: 100%;
    ${flexCenter("flex-end")}
  }

  @media screen and (max-width: 425px) {
    flex-direction: column;
    align-items: center;
    text-align: center;

    > article {
      width: 100%;
    }

    .button-wrapper {
      justify-content: center;
    }
  } ;
`;

const Content = styled.article`
  flex: 1;
  ${flexCenter("", "column", "flex-start")};
  row-gap: 14px;
  color: var(--color4-Gray);
  letter-spacing: 0.05rem;
  line-height: 1.5;

  > * {
    width: 100%;
  }

  h3 {
    font-weight: 400;
    color: var(--color2-White);
    font-size: clamp(1.3rem, 1.5vw, 1.5vw);
  }
  p {
    font-size: clamp(0.75rem, 1.1vw, 1.1rem);
    word-wrap: break-word;
  }
  hr {
    width: 100%;
    background-color: var(--color4-Gray);
    opacity: 0.2;
    margin-top: 0.5rem;
  }
  small b {
    font-weight: 600;
    color: var(--color2-White);
  }
`;
