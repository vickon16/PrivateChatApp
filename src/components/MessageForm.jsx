import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import styled from "styled-components";
import { useChat } from "../context/chatContext";
import { useAuth } from "../context/userAuthContext";
import { collectionNames, db, storage, storageNames } from "../firebase-config";
import { flexCenter } from "../globalFunctions";
import Loader from "./Loader";

const MessageForm = () => {
  const [chatText, setChatText] = useState("");
  const [chatImg, setChatImg] = useState("");
  const {state: { user}} = useAuth();
  const {state : {selectedUser, loading, error}, setLoading, setError} = useChat();

  const user1 = user.uid;
  const user2 = selectedUser.id;

  // id would be the same and would not be overwritten when more chats are added to the sub collectionn "chat"
  const id = user1 > user2 ?  `${user1 + "-" + user2}` :  `${user2 + "-" + user1}`; 

  async function AddDoc(data) {
    // creating a firebase sub collection
    addDoc(collection(db, `${collectionNames.messages}`, id, `${collectionNames.chat}`), {
      chatText, from: user1, to: user2, 
      createdAt: Timestamp.now(), media: data,
    })
    .then(() => {
      setChatText("");
      setChatImg("");
      setLoading(false);
    })
    .catch((err) => setError(err.message));

    // set last message on every message sent
    setDoc(doc(db, `${collectionNames.lastMsg}`, id), {
      chatText, from: user1, to: user2, 
      createdAt: Timestamp.now(), media: data, 
      unread : true
    }).then(() => {
      setChatText("");
      setChatImg("");
      setLoading(false);
    })
    .catch((err) => setError(err.message));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (chatImg) {
      const imgName = `${new Date().getTime()}-${chatImg.name}`;
      const imgRef = ref(storage, `${storageNames.chatAppImages_ChatImages}${imgName}`);
      uploadBytes(imgRef, chatImg).then((snapshot) => {
        getDownloadURL(ref(storage, snapshot.ref.fullPath))
          .then((url) => AddDoc(url))
          .catch((err) => setError(`Failed to get path. ${err.message}`));
      }).catch(err => setError(`Failed to upload img. ${err.message}`))
      return;
    }

    AddDoc("");
  };

  return (
    <Wrapper>
      <Container onSubmit={handleSubmit}>
        <label htmlFor="img">
          {chatImg ? (
            <img src={URL.createObjectURL(chatImg)} alt="chatImg" />
          ) : (
            <FaUpload />
          )}
        </label>
        <input
          type="file"
          id="img"
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => setChatImg(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Enter message"
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
        />
        {loading ? <Loader /> : <button className="btn" disabled={!chatImg && !chatText}>Send</button>}
      </Container>
      {error && <p className="error">{error}</p>}
    </Wrapper>
  );
};

export default MessageForm;

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 20px;
  background-color: var(--color9-Bg2);
`;

const Container = styled.form`
  width: min(100%, 1300px);
  ${flexCenter("flex-end")};
  gap: 5px;

  label {
    flex-shrink: 0;
    width: 30px;
    height: 30px;

    cursor: pointer;
    transition: 0.3s ease-in-out;
    border-radius: 50%;
    overflow: hidden;

    img {
      height: 100%;
    }

    svg {
      width: 30px;
      height: 30px;
    }

    &:hover {
      scale: 1.05;
    }
  }

  input {
    width: min(100%, 400px);
    margin: 0px 10px;
    padding: 10px;
    border: 1px solid var(--color4-Gray);
    color: var(--color2-White);
    font-size: 0.95rem;
    background: transparent;
  }

  .loader-wrapper {
    margin: 0;
  }
`;
