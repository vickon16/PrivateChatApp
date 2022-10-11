import styled from "styled-components";
import MessageForm from "../components/MessageForm";
import User, { UserStatus } from "../components/User";
import { useChat } from "../context/chatContext";
import { useAuth } from "../context/userAuthContext";
import { flexCenter } from "../globalFunctions";
import Message from "../components/Message";
import {MdOutlineClose} from "react-icons/md";
import { useGeneralContext } from "../context/generalContext";
import { Link } from "react-router-dom";

const Home = () => {
  const {state: { userAppData, allExceptCurrentUser }} = useAuth();
  const {state: { selectedUser, selectedUserChats }, exitChat} = useChat();
  const {navOpen, setNavOpen} = useGeneralContext();

  const arr = userAppData?.name.split(" ");
  const displayName = arr[1] ? arr[1] : arr[0];

  // stop propagation when user clicks on the page rather than the user container, and set
  // navOpen to true
  const handleSelectUser = (e) => {
    e.stopPropagation();
    setNavOpen(true);
  }

  return (
    <Container className="home-container" onClick={() => setNavOpen(false)}>
      <UsersContainer navOpen={navOpen} onClick={(e) => e.stopPropagation()}>
        <div className="current-user">
          <small>Welcome,&nbsp;</small> {displayName.trim() + "❤️‍🔥"}
        </div>
        <div className="friends">Logged in users</div>
        <div className="users-wrapper">
          {/* if there are other users in the room, display them */}
          {allExceptCurrentUser.length ? (
            allExceptCurrentUser.map((userData) => (
              <User key={userData.id} userData={userData} />
            ))
          ) : (
            <h3 className="no-user">..You are all alone in this app!..</h3>
          )}
        </div>
        <MdOutlineClose className="close" onClick={() => setNavOpen(false)} />
      </UsersContainer>
      <MessagesContainer>
        {selectedUser ? (
          // two diffrent UI for when the user is selected or not
          <>
            <MessagesUser>
              <Link to={`/selected-user-profile`} className="selected-user">
                <img
                  src={selectedUser?.image?.url || "/user-icon.png"}
                  alt="avatar"
                />
                <h3>{selectedUser.name}</h3>
                <UserStatus status={selectedUser?.isOnline} />
              </Link>
              <button className="btn" onClick={exitChat}>
                Exit Chat
              </button>
            </MessagesUser>
            <AllMessages>
              {selectedUserChats && selectedUserChats.length ? (
                selectedUserChats.map((msg) => (
                  <Message {...msg} key={msg.id} />
                ))
              ) : (
                <p className="no-conv">
                  No Conversation, Please Create one below.{" "}
                </p>
              )}
            </AllMessages>
            <MessageForm />
          </>
        ) : (
          <>
            <p className="no-conv">Select User to start a conversation</p>
            <div className="no-conv-big">...No Conversation Yet!...</div>
            <div className="button-wrapper">
              <button className="btn" onClick={handleSelectUser}>
                Select User
              </button>
            </div>
          </>
        )}
      </MessagesContainer>
    </Container>
  );
};
export default Home;

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 3fr;
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 80px);
  z-index: 0;

  &::before {
    content: "";
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.3;
    background-image: ${(props) => props.theme.BgImg};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  } ;
`;

const UsersContainer = styled.section`
  border-right: 2px solid var(--color9-Bg2);
  background-color: var(--color9-Bg2);
  box-shadow: var(--shadow);
  padding: 30px 10px;
  min-width: 270px;
  overflow: hidden;
  position: relative;
  transition: 0.35s ease-in-out;

  .current-user {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--color6-Dark);
    border-radius: 6px;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 600;
    font-size: clamp(1.1rem, 1.3vw, 1.3rem);
    padding: 1rem 0.5rem 1rem 0.6rem;
    word-wrap: break-word;
    box-shadow: var(--shadow);
    color: var(--color3-Blue);
    
    small {
      color: var(--color4-Gray);
      font-weight: 400;
      font-size: 0.8rem;
    }
  }

  .friends {
    padding: 0 0.6rem;
    margin-bottom: 1.3rem;
    color: var(--color4-Gray);
    font-size: 0.95rem;
    opacity: 0.8;
  }

  .users-wrapper {
    overflow-y: auto;
    height: 100%;
    padding-top: 0.5rem;
  }

  .close {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 1.2rem;
    right: 1.2rem;
    display: none;
    cursor: pointer;
  }

  .no-user {
    font-size: clamp(0.9rem, 1.1vw, 1.1rem);
    color: var(--color4-Gray);
    opacity: 0.8;
    text-align: center;
    width: 80%;
    margin: 0 auto;
    line-height: 1.5;
  }

  @media screen and (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    min-width: none;
    width: min(100%, 300px);
    padding-top: 4rem;
    transform: ${({ navOpen }) =>
      navOpen ? "translateX(0)" : "translateX(120%)"};

    .close {
      display: block;
    }
  } ;
`;

const MessagesContainer = styled.section`
  width: 100%;
  overflow-y: auto;
  margin-bottom: 3rem;
  position: relative;

  .no-conv,
  .no-conv-big {
    font-size: clamp(0.9rem, 1.1vw, 1.1rem);
    color: var(--color4-Gray);
    opacity: 0.8;
    text-align: center;
    width: 80%;
    margin: 2rem auto 0;
    line-height: 1.5;
  }

  .no-conv-big {
    font-size: clamp(1.3rem, 1.7vw, 1.7rem);
    margin-top: 4rem;
  }
  .button-wrapper {
    margin-top: 2rem;
    width: 100%;
    text-align: center;
    display: none;

    @media screen and (max-width: 768px) {
      display: block;
    }
  }
`;

const MessagesUser = styled.article`
  border-bottom: 2px solid var(--color6-Dark);
  padding: 20px 10px 20px 20px;
  ${flexCenter("space-between")};
  gap: 10px;
  width: 100%;
  margin-bottom: 1.5rem;
  position: sticky;
  top: -10px;
  left: 0;
  right: 0;
  z-index: 2;
  background-color: var(--color9-Bg2);
  flex-wrap: wrap;

  .selected-user {
    ${flexCenter()};
    gap: .5rem;
    cursor: pointer;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  h3 {
    font-weight: 500;
    font-size: clamp(1rem, 1.4vw, 1.4rem);
    letter-spacing: 1px;
  }

  button {
    padding: 7px 10px;
  }

  @media screen and (max-width : 350px) {
    justify-content: center;

    button {
      margin: 0;
    }
  };
`;

const AllMessages = styled.article`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 20px;
  margin-bottom: 2.5rem;
  z-index: 1;

  @media screen and (max-width : 425px) {
    padding: 0 10px;
  };
`;
