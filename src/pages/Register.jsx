import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/userAuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, collectionRef } from "../firebase-config";
import Loader from "../components/Loader";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const initialData = {
  name: "",
  email: "",
  password: "",
};

const Register = () => {
  const { state, setLoading, setError } = useAuth();
  const [{ name, email, password }, setData] = useState(initialData);
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
    if (!name || !email || !password) {
      setError("All Fields are Required");
      return;
    }

    // else, sign user in 
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const id = res.user.uid;
        const docRef = doc(collectionRef, id);
        
        // after signup user, set user details to the database
        setDoc(docRef, {
          id, name, email, createdAt: Timestamp.now(), isOnline: true, lastMsg : ""
        })
        .then(() => {
          // reset form data and navigate to home page
          setData(initialData)
          setLoading(false)
          navigate("/")
        })
        .catch((err) => setError(`Failed to register user info. ${err.message}`))
      })
      .catch((err) => setError(`Failed to Create Account. ${err.message}`))
  };

  return (
    <section>
      <h3>Create An Account</h3>
      <form onSubmit={handleSubmit}>
        <article>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleChange}
          />
        </article>
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
