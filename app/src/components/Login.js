import React from "react";
import { THEME } from "../Constants";
import { Link } from "react-router-dom";

const Login = (props) => {
  const { appBodyTheme } = props;

  return (
    <div>
      <form
        className={`register login-form ${
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
            name="email"
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
            name="password"
            placeholder="Password"
            minLength={6}
            required
          />
        </div>
        <p>
          Not a user?&nbsp;
          <Link to="/signup">sign up</Link>
        </p>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
