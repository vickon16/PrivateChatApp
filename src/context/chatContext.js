/* eslint-disable react-hooks/exhaustive-deps */
import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { collectionNames, db } from "../firebase-config";
import { useGeneralContext } from "./generalContext";
import { useAuth } from "./userAuthContext";

const ChatContext = createContext();

const initialState = {
  selectedUser: null,
  selectedUserChats : null,
  text: "",
  loading: false,
  error: "",
};

const ChatContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const {state : {user}} = useAuth();
  const {setNavOpen} = useGeneralContext();

  console.log(state.selectedUser, state.selectedUserChats);

  const setSelectedUserChats = (data) => setState((prev) => ({ ...prev, selectedUserChats: data }));

  const exitChat = () => setState(prev => ({
    ...prev, selectedUser: null, text : "", loading: false, error : ""
  }));

  const setSelectedUser = (data) => {
    setLoading(true);
    setNavOpen(false);
    setState((prev) => ({ ...prev, selectedUser: data }))

    const user1 = user.uid;
    const user2 = data.id;
    
    const id = user1 > user2 ?  `${user1 + "-" + user2}` :  `${user2 + "-" + user1}`; 
    const msgRef = collection(db, `${collectionNames.messages}`, id, `${collectionNames.chat}`);
    const q = query(msgRef, orderBy("createdAt", "asc"));

    onSnapshot(q, snapshot => {
      const allChats = snapshot.docs.map(doc => ({
        ...doc.data(),
        id : doc.id
      }));
      setSelectedUserChats(allChats)
      setLoading(false)
    })

    // get unread documents
    const docRef = doc(db, `${collectionNames.lastMsg}`, id);
    getDoc(docRef).then((docSnap) => {
      if(!docSnap.data()) return; // if there are no unread messages, return
      
      // updateDocument only if another user clicks on it
      if (docSnap.data().from !== user1) {
        updateDoc(docRef, {unread : false})
      }
    }).catch(err => setError(err.message))
  };

  const setText = (data) => setState((prev) => ({ ...prev, text: data }));

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
        setText,
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
