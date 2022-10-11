import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/userAuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, collectionRef } from "../firebase-config";
import Loader from "../components/Loader";
import { doc, updateDoc } from "firebase/firestore";

const initialData = {
  email: "",
  password: "",
};

const Login = () => {
  const { state, setLoading, setError } = useAuth();
  const [{ email, password }, setData] = useState(initialData);
  const navigate = useNavigate();

  // form handle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

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
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const id = res.user.uid;
        const docRef = doc(collectionRef, id);

        // after signin user in, update user details to database
        // with isOnline set to true
        updateDoc(docRef, {isOnline: true})
          .then(() => {
            // reset form data and navigate to home page
            setData(initialData);
            setLoading(false)
            navigate("/")
          })
          .catch((err) => setError(`Failed to Log in. ${err.message}`))
      })
      .catch((err) => setError(`Failed to Log in. ${err.message}`))
  };

  return (
    <section>
      <h3>Log In to your account</h3>
      <form onSubmit={handleSubmit}>
        <article>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleChange}
          />
        </article>
        <article>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleChange}
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
