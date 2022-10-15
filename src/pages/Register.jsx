import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/userAuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, collectionRef } from "../firebase-config";
import Loader from "../components/Loader";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const Register = () => {
  const { state, setLoading, setError } = useAuth();
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // if there is no email and password, return
    if (!name || !email || !password) {
      setError("--All Fields are Required--");
      return;
    }

    // else, sign user in 
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const id = res.user.uid;
      const docRef = doc(collectionRef, id);
        
      // after signup user, set user details to the database
      await setDoc(docRef, {
        id, name, email, createdAt: Timestamp.now(), isOnline: true, lastMsg : ""
      })
      // reset form data and navigate to home page
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false)
      navigate("/")
    } catch (err) {
      setError(`--Failed to Create Account--. ${err.message}`)
    }
  };

  return (
    <section>
      <h3>Create An Account</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="regName">Name</label>
          <input
            type="text"
            id="regName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="regEmail">Email</label>
          <input
            type="email"
            id="regEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="regPassword">Password</label>
          <input
            type="password"
            id="regPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {state.error && <p className="error">{state.error}</p>}
        {state.loading ? (
          <Loader />
        ) : (
          <button className="btn" disabled={!name || !email || !password}>
            Register
          </button>
        )}
        <article className="form-msg">
          Already have an account ? <Link to="/auth/login">Sign in</Link>
        </article>
      </form>
    </section>
  );
};

export default Register;
