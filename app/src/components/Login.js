import React from "react";
import { THEME } from "../Constants";
import { Link } from "react-router-dom";
import { checkUserValidity, getUserId } from "../api";

/**
 *
 * @param {*} props
 * @returns a form asking for email, username and password fields.
 */
const Login = (props) => {
  const {
    appBodyTheme,
    credentials,
    setCredentials,
    setIsUserValid,
    setUserId,
    showAlert,
    handleMailChange,
    handleUsernameChange,
    handlePasswordChange,
    checkedClearDataOption,
    handleClearFormData,
    fetchInitialData,
  } = props;

  /**
   *
   * this function runs for already existing users with correct credentials.
   * first of all this function check user validity and if a user is valid(having correct credentials), it calls getUserId defined in api.js to get user id and calls sidebarAllLists defined in App.js to get all list present in user's account.
   * @param {*} event
   */
  async function handleUserLogin(event) {
    event.preventDefault();
    const { email, username, password } = credentials;
    const response = await checkUserValidity(email, username, password);
    const isValid = response.data.isValid;
    if (isValid) {
      const response = await getUserId(email, username, password);
      const userId = response.data.userId;
      setUserId(userId);
      setIsUserValid(isValid);
      await fetchInitialData(userId);
    } else {
      showAlert("warning", ": Wrong user details.");
    }
    setCredentials({ email: "", username: "", password: "" });
  }

  return (
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
  );
};

export default Login;
