import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/userAuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, collectionRef } from "../firebase-config";
import Loader from "../components/Loader";
import { doc, updateDoc } from "firebase/firestore";

const Login = () => {
  const { state, setLoading, setError } = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // if there is no email and password, return
    if (!email || !password) {
      setError("All Fields are Required");
      return;
    }

    // else, sign user in 
    try {
      const resp = await signInWithEmailAndPassword(auth, email, password);
      const id = resp.user.uid;
      const docRef = doc(collectionRef, id);

      // after signin user in, update user details to database
      // with isOnline set to true
      await updateDoc(docRef, {isOnline: true})
      // reset form data and navigate to home page
      setEmail("");
      setPassword("");
      setLoading(false)
      navigate("/")
    } catch (err) {
      setError(`Failed to Log in. ${err.message}`)
    }
  };

  return (
    <section>
      <h3>Log In to your account</h3>
      <form onSubmit={handleSubmit}>
        <article>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </article>
        <article>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </article>
        {state.error && <p className="error">{state.error}</p>}
        {state.loading ? (
          <Loader />
        ) : (
          <button className="btn" disabled={!email || !password}>
            Login
          </button>
        )}
        <article className="form-msg">
          Do not have an account? <Link to="/auth/register">Sign up</Link>
        </article>
      </form>
    </section>
  );
};

export default Login;
