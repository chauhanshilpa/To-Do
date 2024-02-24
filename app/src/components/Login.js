import React, { useState } from "react";
import { THEME } from "../Constants";
import { Link } from "react-router-dom";
import { checkUserValidity, getUserId } from "../api";

/**
 * @param {*} props
 * @returns a form asking for email, username and password fields.
 */
const Login = (props) => {
  const {
    appBodyTheme,
    modalButtonRef,
    setIsUserValid,
    setUserId,
    showAlert,
    fetchInitialData,
  } = props;

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [clearDataOptionChecked, setClearDataOptionChecked] = useState(false);

  function handleLoginCredentialsChange(event) {
    const { name, value } = event.target;
    setLoginCredentials({
      ...loginCredentials,
      [name]: value,
    });
  }

  /**
   *
   * this function runs for already existing users with correct credentials.
   * first of all this function check and set user validity and if a user is valid(having correct credentials), it calls getUserId defined in api.js to get user id, then calls fetchInitialData defined in app.js to get a default page while window moves to main application.
   * @param {*} event
   */
  async function handleUserLogin(event) {
    event.preventDefault();
    const { email, username, password } = loginCredentials;
    try {
      const response = await checkUserValidity(email, username, password);
      const isValid = response.data.isValid;
      if (isValid) {
        const response = await getUserId(email, username, password);
        const userId = response.data.userId;
        setUserId(userId);
        setIsUserValid(isValid);
        localStorage.setItem("userId", userId);
        await fetchInitialData(userId);
      } else {
        showAlert("warning", ": Wrong user details.");
      }
    } catch (error) {
      modalButtonRef.current.click();
    }
    setLoginCredentials({ email: "", username: "", password: "" });
  }

  /**
   * clears all the field data of login form
   */
  function handleClearFormData() {
    setLoginCredentials({
      email: "",
      username: "",
      password: "",
    });
    setClearDataOptionChecked(true);
    setTimeout(() => {
      setClearDataOptionChecked(false);
    }, 500);
  }

  return (
    <form
      className={`register login-form ${
        appBodyTheme === THEME.DARK.name
          ? THEME.DARK.className
          : THEME.LIGHT.className
      }`}
      onSubmit={handleUserLogin}
    >
      <h4 className="text-center">Login</h4>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
          placeholder="Email address"
          name="email"
          value={loginCredentials.email}
          onChange={handleLoginCredentialsChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Username"
          name="username"
          value={loginCredentials.username}
          onChange={handleLoginCredentialsChange}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          autoComplete="off"
          name="password"
          value={loginCredentials.password}
          onChange={handleLoginCredentialsChange}
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
            defaultValue="Initial value"
            checked={clearDataOptionChecked || false}
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
  );
};

export default Login;
