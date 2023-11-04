import React from "react";
import { THEME } from "../Constants";
import { Link } from "react-router-dom";

/**
 *
 * @param {*} props
 * @returns a form asking for email, username , password and confirm password fields.
 */
const Signup = (props) => {
  const {
    appBodyTheme,
    credentials,
    handleUsernameChange,
    handleMailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleUserSignUp,
    checkedClearDataOption,
    handleClearFormData,
  } = props;
  return (
    <>
      <form
        className={`register ${
          appBodyTheme === THEME.DARK.name
            ? THEME.DARK.className
            : THEME.LIGHT.className
        }`}
        onSubmit={handleUserSignUp}
        autoComplete="off"
      >
        <h4 className="text-center">Signup</h4>
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
            required
            minLength={6}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm password"
            value={credentials.confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </div>
        <div className="form-lower">
          <p>
            Already a user?&nbsp;
            <Link to="/login">log in</Link>
          </p>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="defaultCheck1"
              checked={checkedClearDataOption}
              onChange={handleClearFormData}
            />
            <label className="form-check-label" for="defaultCheck1">
              clear field
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </>
  );
};

export default Signup;
