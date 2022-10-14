import { addDoc, collection, doc, Timestamp, updateDoc } from "firebase/firestore";
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

  const user1 = user.uid; // current user Id
  const user2 = selectedUser.id; // selected user Id


  // creating a unique merged id for -current user & -selected user conversation
  const mergeId = user1 > user2 ?  `${user1 + "-" + user2}` :  `${user2 + "-" + user1}`; 

  const AddDoc = async (url) => {
    const data = {
      chatText,
      from: user1,
      to: user2,
      createdAt: Timestamp.now(),
      media: url,
    };
    const docRefce = collection( db, `${collectionNames.messages}`, mergeId, `${collectionNames.chat}`)

    // creating a firebase sub collection
    // database | messages | mergeId | chat | document
    try {
      await addDoc(docRefce, { ...data });
      // set last message on every message sent to the selected user
      // to current user document path
      const docRef = doc(db, `${collectionNames.chatApp}`, user2);
      await updateDoc(docRef, { lastMsg: { ...data } });

      // clear the formal lastSeen message from the second user, acknoledging
      // that we have seen the last message
      const docRef2 = doc(db, `${collectionNames.chatApp}`, user1);
      await updateDoc(docRef2, { lastMsg: "" });
      // reset Text and Img
      setChatText("");
      setChatImg("");
      setLoading(false);
    } catch (err) {
      setError(err.message)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // if there is an Image, upload the image before adding document to the 
    // messages collection
    if (chatImg) {
      // convert image to bytes
      const imgSize = chatImg.size / 1024;
      // check if image size is greater than 2.5mb
      if (imgSize > 2500) {
        setError("Files size is too large, Select another image");
        setChatImg("");
        return;
      }
      
      const imgName = `${new Date().getTime()}-${chatImg.name}`;
      const imgRef = ref(storage, `${storageNames.chatAppImages_ChatImages}${imgName}`);
      uploadBytes(imgRef, chatImg).then((snapshot) => {
        getDownloadURL(ref(storage, snapshot.ref.fullPath))
          .then((url) => AddDoc(url))
          .catch((err) => setError(`Failed to get path. ${err.message}`));
      }).catch(err => setError(`Failed to upload img. ${err.message}`))
      return;
    }

    // if there is no image, just add the doc without it
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
