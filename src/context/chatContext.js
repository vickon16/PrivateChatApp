/* eslint-disable react-hooks/exhaustive-deps */
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { collectionNames, db } from "../firebase-config";
import { useGeneralContext } from "./generalContext";
import { useAuth } from "./userAuthContext";

const ChatContext = createContext();

const initialState = {
  selectedUser: null,
  selectedUserChats : null,
  loading: false,
  error: "",
};

const ChatContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const {state : {user}} = useAuth();
  const {setNavOpen} = useGeneralContext();

  const setSelectedUserChats = (data) => setState((prev) => ({ ...prev, selectedUserChats: data }));

  const exitChat = () => setState(prev => ({
    ...prev, selectedUser: null, text : "", loading: false, error : ""
  }));

  const setSelectedUser = (data) => {
    setLoading(true);
    setNavOpen(false);

    // get the selected userData when it is selected
    setState((prev) => ({ ...prev, selectedUser: data }))
    const user1 = user.uid; // current user id
    const user2 = data.id; // selected user id
    
    const mergeId = user1 > user2 ?  `${user1 + "-" + user2}` :  `${user2 + "-" + user1}`; 

    const msgRef = collection(db, `${collectionNames.messages}`, mergeId, `${collectionNames.chat}`);
    // get the message chat sub collection and query by "createdAt"
    const q = query(msgRef, orderBy("createdAt", "asc"));

    // get all the chats when user is selected
    onSnapshot(q, snapshot => {
      const allChats = snapshot.docs.map(doc => ({
        ...doc.data(),
        id : doc.id
      }));
      setSelectedUserChats(allChats)
      setLoading(false)
    })

    // set lastMsg back to empty string
    // when user1 selects a user with an unread message.
    // we look into the user2 document, which tell him that we have seen his message.
    const docRef = doc(db, `${collectionNames.chatApp}`, user1);
    updateDoc(docRef, { lastMsg: "" });
  };


  const setLoading = (state) =>
    setState((prev) => ({ ...prev, loading: state }));
  const setError = (msg) => {
    if(msg) {setLoading(false);}

    setState((prev) => ({ ...prev, error: msg }));
    setTimeout(() => setState((prev) => ({ ...prev, error: "" })), 4000);
  };


  return (
    <ChatContext.Provider
      value={{
        state,
        setSelectedUser,
        setLoading,
        setError,
        exitChat
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

export default ChatContextProvider;
