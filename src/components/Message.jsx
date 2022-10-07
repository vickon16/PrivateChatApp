import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import styled from 'styled-components'
import { useChat } from '../context/chatContext';
import { useAuth } from '../context/userAuthContext';
import { collectionNames, db } from '../firebase-config';
import { flexCenter, formatDateAgo } from '../globalFunctions';

const Message = ({id, chatText, createdAt, from, media}) => {
  const scrollRef = useRef();
  const {state: { user}} = useAuth();
  const {state : {selectedUser}} = useChat();

  const user1 = user.uid;
  const user2 = selectedUser.id;

  const rootId = user1 > user2 ?  `${user1 + "-" + user2}` :  `${user2 + "-" + user1}`; 

  const handleClick = async () => {
    if (from !== user1) return; // means the message clicked is not a user1 message and cannot be deleted
    const confirm = window.confirm("Delete message?");

    if (confirm) {
      const docRef = doc(db, `${collectionNames.messages}`, rootId, `${collectionNames.chat}`, id);

      if (media) {
        deleteDoc(docRef).then(() => console.log("deleted successfully"))
      }
      updateDoc(docRef, { chatText: "🚫 deleted" }).then(() => {
        console.log("updated successfully");
      });
      setTimeout(() => {
        deleteDoc(docRef).then(() => console.log("deleted successfully"))
      }, 30000); // delete item after 10mins
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior : "smooth"});
  }, [chatText])

  const {state : {userAppData}} = useAuth();

  return (
    <Container own={from === userAppData.id} ref={scrollRef}>
      <Deviation
        owner={from === userAppData.id ? "me" : "friend"}
        onClick={handleClick}>
        {media && <img src={media} alt={chatText} />}
        {chatText === "🚫 deleted" ? (
          <p className="deleted">{chatText}</p>
        ) : (
          <>
            <p>{chatText}</p>
            <small>{formatDateAgo(createdAt)}</small>
          </>
        )}
      </Deviation>
    </Container>
  );
}

export default Message

const Container = styled.aside`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: ${({ own }) => (own ? "flex-end" : "flex-start")};
  cursor: pointer;

  &:has(.deleted) {
    pointer-events: none;
    cursor: not-allowed;
  }

  @media screen and (max-width: 425px) {
    cursor: default;
  } ;
`;

const Deviation = styled.div`
  padding: 10px;
  display: inline-block;
  min-width: 130px;
  max-width: 70%;
  border-radius: 5px;
  box-shadow: var(--shadow);
  border: 2px solid var(--color7-Dark2);
  ${flexCenter("space-between", "column", "flex-start")};
  gap: 10px;
  background-color: ${({ owner }) =>
    owner === "me" ? "var(--color8-Blue2)" : "var(--color6-Dark)"};

  p {
    border-top: 0.5px solid var(--color7-Dark2);
    border-bottom: 0.5px solid var(--color7-Dark2);
    padding: 5px 0;
    font-size: clamp(0.85rem, 1vw, 1rem);

    &.deleted {
      font-style: italic;
      font-weight: 300;
      color: var(--color4-Gray);
    }
  }

  img {
    max-height: 300px;
    border-radius: 5px;
  }

  small {
    font-size: 0.7rem;
    color: var(--color4-Gray);
  }

  @media screen and (max-width: 425px) {
    img {
      max-height: 200px;
    }
  } ;
`;
