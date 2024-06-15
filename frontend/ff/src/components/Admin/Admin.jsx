import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css"; // Import CSS file for styling

const Admin = () => {
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
      ? "http://localhost:3000/admin/login"
      : "http://localhost:3000/admin/add";

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
      console.log(`${isLogin ? "Login" : "Signup"} success. Admin ID:`, data.id);

      // Redirect to profile page after successful login/signup
      navigate(`/admin/${data.id}`);
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Signup"} error:`, error.message);
      // Handle login/signup error (e.g., show error message to user)
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
      </div>
      <h2 className="admin-title">{isLogin ? "Admin Login" : "Admin Signup"}</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="admin-input">
            <label className="admin-label">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={inputs.name}
              onChange={handleChange}
              required={!isLogin}
              className="admin-textfield"
            />
          </div>
        )}
        <div className="admin-input">
          <label className="admin-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
            required
            className="admin-textfield"
          />
        </div>
        <div className="admin-input">
          <label className="admin-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            required
            className="admin-textfield"
          />
        </div>
        <button type="submit" className="admin-button">
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

export default Admin;
