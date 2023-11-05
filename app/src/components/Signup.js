import React from "react";
import { THEME } from "../Constants";
import { Link } from "react-router-dom";
import { userRegistered, addNewUser, getUserId } from "../api";

/**
 *
 * @param {*} props
 * @returns a form asking for email, username , password and confirm password fields.
 */
const Signup = (props) => {
  const {
    appBodyTheme,
    credentials,
    setCredentials,
    setUserId,
    setIsUserValid,
    showAlert,
    handleUsernameChange,
    handleMailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    checkedClearDataOption,
    handleClearFormData,
    fetchInitialData,
  } = props;

  /**
   * 
   * This function runs first time when a user registers. 
   * This function first checks whether password and confirm password are same, if not it shows an alert. If both are same then it checks whether a user is already registered or not. If user is not registered, addNewUser function defined in api.js is called which adds a new user details and make two default lists. 
   Then it calls getUserId function defined in api.js which gets user id, then set it in a variable.
   Further sidebarAllLists function is called defined in app.js which will set values of predefined lists so that a user can see it in UI. AT the end, isUserValid variable is set to to true so that user can use the application for maintaining its to dos.
   * @param {*} event 
   */
  async function handleUserSignUp(event) {
    event.preventDefault();
    const { email, username, password, confirmPassword } = credentials;
    const response = await userRegistered(email);
    const isUserRegistered = response.data.registered;
    if (password === confirmPassword) {
      if (isUserRegistered === false) {
        await addNewUser(email, username, password);
        const response = await getUserId(email, username, password);
        const userId = response.data.userId;
        setUserId(userId);
        setIsUserValid(true);
        await fetchInitialData(userId);
      } else {
        showAlert("warning", ": User with this email already exists.");
      }
      setCredentials({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
    } else {
      showAlert("warning", ": Confirm password is different from password.");
    }
  }

  return (
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
          <label className="form-check-label" htmlFor="defaultCheck1">
            clear field
          </label>
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </form>
  );
};

export default Signup;
