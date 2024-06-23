import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuthButton = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authHandler = async () => {
    // Initialize Firebase Auth provider
    const provider = new GoogleAuthProvider();
    // whenever a user interacts with the provider, we force them to select an account
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      // from here i am calling an api to store that data into db.
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle?.user?.displayName,
          email: resultsFromGoogle?.user?.email,
          googlePhotoUrl: resultsFromGoogle?.user?.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure("Login Failed"));
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={authHandler}
    >
      <AiFillGoogleCircle size={20} className="mr-2" />
      Continue with Google
    </Button>
  );
};

export default OAuthButton;
