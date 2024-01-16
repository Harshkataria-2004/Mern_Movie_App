import React, { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginMessage, setLoginMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userData = await response.json();
      if (response.ok) {
        setLoginMessage(userData.message); // Set the login message

        // Store email in sessionStorage after successful login
        localStorage.setItem("userEmail", loginData.email);

        window.location.href = "/";
      } else {
        setLoginMessage(userData.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        body: JSON.stringify(signupData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userData = await response.json();
      if (response.status === 201) {
        setSignupMessage(userData.message); // Set the signup message

        // Store email in sessionStorage after successful signup
        localStorage.setItem("userEmail", signupData.email);

        window.location.href = "/";
      } else {
        setSignupMessage(userData.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      // Handle signup error
    }
  };

  const handleLoginInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupInputChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input type="checkbox" className="toggle" />
            <span className="slider"></span>
            <span className="card-side"></span>
            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">Log in</div>
                <form
                  className="flip-card__form"
                  action=""
                  onSubmit={handleLogin}
                >
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                  />
                  <button className="flip-card__btn" type="submit">
                    Let`s go!
                  </button>
                  {loginMessage && <p className="message">{loginMessage}</p>}
                </form>
              </div>
              <div className="flip-card__back">
                <div className="title">Sign up</div>
                <form
                  className="flip-card__form"
                  action=""
                  onSubmit={handleSignup}
                >
                  <input
                    className="flip-card__input"
                    name="name"
                    placeholder="Name"
                    type="name"
                    value={signupData.name}
                    onChange={handleSignupInputChange}
                  />
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={signupData.email}
                    onChange={handleSignupInputChange}
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={signupData.password}
                    onChange={handleSignupInputChange}
                  />
                  <button className="flip-card__btn" type="submit">
                    Confirm!
                  </button>
                  {signupMessage && <p className="message">{signupMessage}</p>}
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
