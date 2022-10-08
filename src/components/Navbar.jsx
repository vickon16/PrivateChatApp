/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { flexCenter } from "../globalFunctions";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/userAuthContext";
import { signOut } from "firebase/auth";
import { auth, collectionRef } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { GiHamburgerMenu } from "react-icons/gi";
import { useGeneralContext } from "../context/generalContext";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";

const Navbar = () => {
  const {
    state: { user, userAppData },
    setError,
  } = useAuth();
  const {darkMode, setNavOpen, toggleMode } = useGeneralContext();

  const logout = async () => {
    signOut(auth)
      .then(() => {
        const docRef = doc(collectionRef, user?.uid);
        updateDoc(docRef, { isOnline: false });
      })
      .catch((err) => setError(`Log out Unsuccessfull. ${err.message}`));
  };

  return (
    <Wrapper>
      <Nav>
        <h2>
          <Link to="/" className="nav-title">
            Chat App
          </Link>
        </h2>
        <NavLinks>
          <Mode onClick={toggleMode}>
            {darkMode ? <MdDarkMode /> : <MdOutlineDarkMode />}
          </Mode>
          {user !== null ? (
            <>
              <NavLink to="/profile">
                <img
                  src={userAppData?.image?.url || "/user-icon.png"}
                  alt="profile-img"
                />
              </NavLink>
              <a href="#" className="btn" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <NavLink to="/auth/register">Register</NavLink>
              <NavLink to="/auth/login">Login</NavLink>
            </>
          )}
          <a href="#" className="hamburger" onClick={() => setNavOpen(true)}>
            <GiHamburgerMenu />
          </a>
        </NavLinks>
      </Nav>
    </Wrapper>
  );
};

export default Navbar;

const Wrapper = styled.div`
  background-color: var(--color9-Bg2);
`;
const Nav = styled.nav`
  width: min(100%, 1300px);
  margin: 0 auto;
  ${flexCenter("space-between")};
  height: 80px;
  padding: 10px 30px;
  box-shadow: var(--shadow);
  flex-wrap: wrap;
  gap: 20px 10px;

  h2 {
    font-size: clamp(1.1rem, 1.4vw, 1.4rem);

    a {
      font-family: "Space Grotesk", sans-serif;
    }
  }

  @media screen and (max-width: 425px) {
    padding: 10px 15px;
  }

  @media screen and (max-width: 350px) {
    padding: 20px;
    justify-content: center;
    height: fit-content;
  } ;
`;

const NavLinks = styled.div`
  ${flexCenter()};
  gap: 15px;

  > a {
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }

    &.active {
      color: var(--active);
    }
  }

  .hamburger {
    display: none;

    svg {
      width: 30px;
      height: 30px;
    }

    @media screen and (max-width: 768px) {
      display: block;
    }
  }

  @media screen and (max-width : 425px) {
    gap: 10px;

    a img {
      width: 30px;
      height: 30px;
    }

    .btn {
      padding: 8px;
      font-size: .8rem;
    }

    .hamburger svg {
      width: 25px;
      height: 25px;
    }
  };
`;

const Mode = styled.a`
  cursor: pointer;
  
  svg {
    width: 35px;
    height: 35px;
  }

  @media screen and (max-width : 425px) {
    svg {
      width: 30px;
      height: 30px;
    }
  };
`
