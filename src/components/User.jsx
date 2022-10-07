/* eslint-disable react-hooks/exhaustive-deps */
import {flexCenter} from "../globalFunctions";
import styled from 'styled-components';
import { useChat } from "../context/chatContext";
import { useAuth } from "../context/userAuthContext";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { collectionNames, db } from "../firebase-config";

const User = ({userData}) => {
   const {state : {selectedUser}, setSelectedUser } = useChat();
   const {state : {userAppData}} = useAuth();
   const [lastMsgData, setLastMsgData] = useState("");

  const {from, unread, chatText} = lastMsgData;
   
   const user1 = userAppData.id;
   const user2 = selectedUser?.id;
   const selected = selectedUser?.name === userData?.name
   const id = user1 > user2 ?  `${user1 + "-" + user2}` :  `${user2 + "-" + user1}`; 
   
   useEffect(() => {
    setLastMsgData("");
    const docRef = doc(db, `${collectionNames.lastMsg}`, id);
    const unSub = onSnapshot(docRef, snapshot => {
      if (!snapshot.data()) return;
      setLastMsgData(snapshot.data());
    })

    return () => unSub();
   }, [user2])

  return (
    <Container selected={selected} onClick={() => setSelectedUser(userData)}>
      <UserInfo>
        <img src={userData?.image?.url || "/user-icon.png"} alt="avatar" />
        <div className="user-detail">
          <h4>{userData?.name}</h4>
          {selected && lastMsgData && (
            <small>
              <span>{from === user1 ? "Me" : "Friend"}</span> : {chatText}
            </small>
          )}
        </div>
        {selected && from !== user1 && unread && <small className="unread">new</small>}
        <UserStatus status={userData?.isOnline} />
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
