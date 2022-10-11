/* eslint-disable react-hooks/exhaustive-deps */
import { onAuthStateChanged } from "firebase/auth";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, collectionRef } from "../firebase-config";
import Loader from "../components/Loader";

const UserAuthContext = createContext();

const initialState = {
  user: null,
  userAppData: null,
  allExceptCurrentUser: null,
  loading: false,
  error: "",
};

const UserAuthContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [appLoading, setAppLoading] = useState(true);

  // set current user via onAuthState Changed
  const setUser = (data) => setState((prev) => ({ ...prev, user: data }));

  // set current user Conplete form Data.
  const setUserAppData = (data) =>
    setState((prev) => ({ ...prev, userAppData: data }));

  // set all signup users except current user
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
      // this triggers when we register, login, signout
      // if there is no user, set User to null, so as to return back to
      // login page when user changes
      if (!user) {
        setUser(null);
        setAppLoading(false);
        return;
      }

      // set authUserData if there is a user
      setUser(user);

      // a document has been set already on signup, so we retrive the userData
      const queryCreatedAt = query(collectionRef, orderBy("createdAt", "desc"));
      onSnapshot(queryCreatedAt, (data) => {
        if (!data.docs.length) return; // if there is no Data, return

        // if there is, find the current user in the db based on the auth.uid
        const currentUser = data.docs.find((doc) => doc.data().id === user.uid);
        // set single userData
        setUserAppData(currentUser.data());

        // get all the users Except current user
        const allExceptCurrentUser = data.docs.filter(
          (doc) => doc.data().id !== user.uid
        );
        const allUsers = allExceptCurrentUser.map((data) => data.data());
        setAllExceptCurrentUser(allUsers);

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
