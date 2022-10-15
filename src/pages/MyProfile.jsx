/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { flexCenter, formatDate } from "../globalFunctions";
import { AiFillCamera } from "react-icons/ai";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collectionRef, storage, storageNames } from "../firebase-config";
import { useAuth } from "../context/userAuthContext";
import { doc, updateDoc } from "firebase/firestore";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const MyProfile = () => {
  const [img, setImg] = useState("");
  const {state: { user, userAppData, loading, error }, setError, setLoading,
  } = useAuth();

  useEffect(() => {
    // if there is no img or it is undefined, return
    if (!img || img === undefined) return;
    // convert img size to bytes 
    const imgSize = img.size / 1024; 
    // check if image size is greater than 2.5mb
    if (imgSize > 2500) {
      setError("--Files size is too large, Select another image--")
      setImg("");
      return;
    }

    // else
    const postProfileImg = async () => {
      try {
        setLoading(true);
        setError("");

        // else if there is already an existing user image in the app, delete from storage
        if (userAppData?.image?.url) {
          await deleteObject(ref(storage, userAppData.image.url));
        }

        // else, create a new image for user
        const imgName = `${new Date().getTime()}-${img.name}`;
        const storageRef = ref(storage, `${storageNames.chatAppImages_Avatar}${imgName}`);

        const snapshot = await uploadBytes(storageRef, img);
        const url = await getDownloadURL(ref(storage, snapshot.ref.fullPath));
        
        // update firestore database with new Image
        const docRef = doc(collectionRef, user.uid);
        await updateDoc(docRef, { image: { name: imgName, url } })
      } catch (err) {
        setError(`Failed to upload image . ${err.message}`)
      } finally {
        setLoading(false);
        setImg("")
      }
    }

    postProfileImg()
  }, [img]);

  return (
    <Wrapper>
      <Container>
        <article className="img-container">
          {loading ? (
            <Loader />
          ) : (
            <img
              src={userAppData?.image?.url || "/user-icon.png"}
              alt="profile-img"
            />
          )}
          <label htmlFor="photo" className="overlay">
            <AiFillCamera />
            <input
              type="file"
              id="photo"
              accept="image/*"
              disabled={loading}
              style={{ display: "none" }}
              onChange={(e) => setImg(e.target.files[0])}
            />
          </label>
        </article>
        <Content>
          <h3>{userAppData?.name}</h3>
          <p>{userAppData?.email}</p>
          <hr />
          <small>
            Joined on <b>{formatDate(userAppData?.createdAt)}</b>
          </small>
          {error && <p className="error">{error}</p>}
        </Content>
        <article className="button-wrapper">
          <Link to="/" className="btn">Back to Home</Link>
        </article>
      </Container>
    </Wrapper>
  );
};

export default MyProfile;

const Wrapper = styled.section`
  width: 100%;
`;
const Container = styled.div`
  width: min(100%, 550px);
  margin: 0 auto;
  box-shadow: var(--shadow);
  padding: 35px 20px;
  ${flexCenter("", "", "flex-start")};
  gap: 30px 20px;
  user-select: none;
  flex-wrap: wrap;

  .img-container {
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    border-radius: 50%;
    border: 2px solid var(--color4-Gray);

    .overlay {
      position: absolute;
      background-color: var(--color1-Bg);
      opacity: 0;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      ${flexCenter("center")};
      cursor: pointer;
      transition: 0.35s ease-in-out;

      svg {
        width: 40px;
        height: 40px;
        opacity: 0;
        transition: 0.35s ease-in-out;
      }
    }

    img {
      height: 100%;
    }

    &:hover {
      .overlay {
        opacity: 0.6;

        svg {
          opacity: 1;
        }
      }
    }
  }

  .button-wrapper {
    width: 100%;
    ${flexCenter("flex-end")}
  }

  @media screen and (max-width: 425px) {
    flex-direction: column;
    align-items: center;
    text-align: center;

    > article {
      width: 100%;
    }

    .button-wrapper {
      justify-content: center;
    }
  } ;
`;

const Content = styled.article`
  flex: 1;
  ${flexCenter("", "column", "flex-start")};
  row-gap: 14px;
  color: var(--color4-Gray);
  letter-spacing: 0.05rem;
  line-height: 1.5;

  > * {
    width: 100%;
  }

  h3 {
    font-weight: 400;
    color: var(--color2-White);
    font-size: clamp(1.3rem, 1.5vw, 1.5vw);
  }
  p {
    font-size: clamp(0.75rem, 1.1vw, 1.1rem);
    word-wrap : break-word;
  }
  hr {
    width: 100%;
    background-color: var(--color4-Gray);
    opacity: 0.2;
    margin-top: 0.5rem;
  }
  small b {
    font-weight: 600;
    color: var(--color2-White);
  }
`;
