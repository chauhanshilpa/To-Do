import React, { useState } from "react";
import { THEME } from "../Constants";
import { Link } from "react-router-dom";

const Login = (props) => {
  const {
    appBodyTheme,
    credentials,
    handleMailChange,
    handleUsernameChange,
    handlePasswordChange,
    handleUserLogin,
    checkedClearDataOption,
    handleClearFormData,
  } = props;

  /**
   *
   * @param {*} props
   * @returns a form asking for email, username and password fields.
   */
  return (
    <>
      <form
        className={`register login-form ${
          appBodyTheme === THEME.DARK.name
            ? THEME.DARK.className
            : THEME.LIGHT.className
        }`}
        onSubmit={handleUserLogin}
        autoComplete="off"
      >
        <h4 className="text-center">Login</h4>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Email address"
            value={credentials.email}
            onChange={handleMailChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Username"
            value={credentials.username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handlePasswordChange}
            minLength={6}
            required
          />
        </div>
        <div className="form-lower">
          <p>
            Not a user?&nbsp;
            <Link to="/signup">sign up</Link>
          </p>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="defaultCheck1"
              checked={checkedClearDataOption}
              onChange={handleClearFormData}
            />
            <label className="form-check-label" htmlFor="defaultCheck1">
              clear field
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
