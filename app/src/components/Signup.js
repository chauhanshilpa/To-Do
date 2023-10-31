import React from "react";
import { THEME } from "../Constants";
import { Link } from "react-router-dom";

const Signup = (props) => {
  const { appBodyTheme } = props;
  return (
    <>
      <form
        className={`register ${
          appBodyTheme === THEME.DARK.name
            ? THEME.DARK.className
            : THEME.LIGHT.className
        }`}
      >
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Email address"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Username"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
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
          />
        </div>
        <p>
          Already a user?&nbsp;
          <Link to="/login">log in</Link>
        </p>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default Signup;
