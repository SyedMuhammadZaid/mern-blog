import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuthButton from "../components/OauthButton";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all the fields");
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/sign-in");
      }

      if (!data?.success) {
        setErrorMessage(data.message);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <Link to={"/"} className="text-3xl font-bold dark:text-white">
            <span className="px-2 mr-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Programming
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5 mb-2">
            This is a programming project, you can signup with your email and
            password or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-3" onSubmit={formSubmitHandler}>
            <div>
              <Label value="Your Username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="userName"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>

            <Button
              gradientDuoTone={"purpleToPink"}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-2">Loading.....</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuthButton />
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account? </span>
            <Link to="/sign-in" className="text-blue-500">
              Sign in
            </Link>
          </div>

          {errorMessage && (
            <Alert color={"failure"} className="mt-5">
              {errorMessage && errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
