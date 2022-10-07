/* eslint-disable react-hooks/exhaustive-deps */
import { onAuthStateChanged } from "firebase/auth";
import { onSnapshot, orderBy, query} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, collectionRef } from "../firebase-config";
import Loader from "../components/Loader";

const UserAuthContext = createContext();

const initialState = {
  user: null,
  userAppData: null,
  allExceptCurrentUser : null,
  loading: false,
  error: "",
};

const UserAuthContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [appLoading, setAppLoading] = useState(true);

  const setUser = (data) => setState((prev) => ({ ...prev, user: data }));

  const setUserAppData = (data) =>
    setState((prev) => ({ ...prev, userAppData: data }));

  const setAllExceptCurrentUser = (data) =>
    setState((prev) => ({ ...prev, allExceptCurrentUser: data }));

  const setLoading = (state) =>
    setState((prev) => ({ ...prev, loading: state }));
  const setError = (msg) => {
    if (msg) {
      setLoading(false);
    }
    setState((prev) => ({ ...prev, error: msg }));
    setTimeout(() => setState((prev) => ({ ...prev, error: "" })), 4000);
  };

  // this useEffect triggers the second one automatically
  useEffect(() => {
    let unSub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUser(null);
        setAppLoading(false) 
        return;
      }

      setUser(user);

      const queryCreatedAt = query(collectionRef, orderBy("createdAt", "desc"));
      onSnapshot(queryCreatedAt, (data) => {
        if (!data.docs.length) return; 
      
        const currentUser = data.docs.find(
          (doc) => doc.data().id === user.uid
        );
        setUserAppData(currentUser.data()); // set single userData

        const allExceptCurrentUser = data.docs.filter(
          (doc) => doc.data().id !== user.uid
        );
        const allUsers = allExceptCurrentUser.map((data) => data.data());
        setAllExceptCurrentUser(allUsers); // set all users

        setAppLoading(false);
      });
    });

    return () => unSub();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        state,
        setUser,
        setLoading,
        setError,
      }}>
      {appLoading ? <Loader /> : children}
    </UserAuthContext.Provider>
  );
};

export const useAuth = () => useContext(UserAuthContext);

export default UserAuthContextProvider;
