import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./User.css"; // Import CSS file for styling

const User = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:3000/user/login"
      : "http://localhost:3000/user/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error(`${isLogin ? "Login" : "Signup"} failed`);
      }

      const data = await response.json();
      console.log(`${isLogin ? "Login" : "Signup"} success. User ID:`, data.id);

      // Redirect to profile page after successful login/signup
      navigate(`/user/${data.id}`);
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Signup"} error:`, error.message);
      // Handle login/signup error (e.g., show error message to user)
    }
  };

  return (
    <div className="user-container">
      <div className="user-header">
      </div>
      <h2 className="user-title">{isLogin ? "User Login" : "User Signup"}</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="user-input">
            <label className="user-label">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={inputs.name}
              onChange={handleChange}
              required={!isLogin}
              className="user-textfield"
            />
          </div>
        )}
        <div className="user-input">
          <label className="user-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
            required
            className="user-textfield"
          />
        </div>
        <div className="user-input">
          <label className="user-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            required
            className="user-textfield"
          />
        </div>
        <button type="submit" className="user-button">
          {isLogin ? "Login" : "Signup"}
        </button>
        <button
          type="button"
          className="switch-button"
          onClick={() => setIsLogin(!isLogin)}
        >
          Switch to {isLogin ? "Signup" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default User;
