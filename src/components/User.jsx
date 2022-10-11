/* eslint-disable react-hooks/exhaustive-deps */
import {flexCenter} from "../globalFunctions";
import styled from 'styled-components';
import { useChat } from "../context/chatContext";
import {BsImageFill} from "react-icons/bs";
import { useAuth } from "../context/userAuthContext";

const User = ({userData}) => {
  const {state : {userAppData : {lastMsg}}} = useAuth();
   const {state : {selectedUser}, setSelectedUser } = useChat();
   const {image, name, isOnline, id} = userData;
   
   const selected = selectedUser?.id === id // if the selected user matches the the id of any of the users in the room

  //  if the lastMsg from the currentUser is present, and the last message is from any of the user in the list, display last messages
   const userTarget = lastMsg && lastMsg.from === userData.id

  return (
    <Container selected={selected} onClick={() => setSelectedUser(userData)}>
      <UserInfo>
        <img src={image?.url || "/user-icon.png"} alt="avatar" />
        <div className="user-detail">
          <h4>{name}</h4>
          {userTarget && (
            <small><span>Friend : </span>{lastMsg.chatText || <BsImageFill />}</small>
          )}
        </div>
        {userTarget && <small className="unread">new</small>}
        <UserStatus status={isOnline} />
      </UserInfo>
    </Container>
  );
}

export default User;

const Container = styled.article`
  margin-bottom: 10px;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid var(--color6-Dark);
  background-color: ${({selected}) => selected ? "var(--color6-Dark)" : "inherit"};
  border-radius: 5px;
  position: relative;
`;
const UserInfo = styled.div`
  ${flexCenter("flex-start")};
  gap: 12px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-detail {
    ${flexCenter("", "column", "flex-start")};
    gap: 8px;
    flex: 1;
    overflow: hidden;

    h4 {
      font-weight: 500;
      font-size: clamp(0.85rem, 1.1vw, 1.1rem);
    }

    small {
      font-size: 0.7rem;
      color: var(--color4-Gray);
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      span {
        color: var(--active);
      }

      svg {
        color: var(--color4-Gray);
        margin-left: .3rem;
        vertical-align: bottom;
      }
    }
  }

  .unread {
    position: absolute;
    top: -0.3rem;
    right: 0rem;
    background-color: var(--active);
    padding: 2px 4px;
    border-radius: 50px;
    font-size: .65rem;
  }

  @media screen and (max-width: 768px) {
    img {
      width: 30px;
      height: 30px;
    }
  }
`;

const UserStatus = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ status }) => status ? "var(--active)" : "var(--color5-Red)"};
  margin-left: auto;
`;
