import React, { useState } from "react";
import { THEME } from "../Constants";
import { Link } from "react-router-dom";
import { userRegistered, addNewUser, getUserId } from "../api";

/**
 * @param {*} props
 * @returns a form asking for email, username , password and confirm password fields.
 */
const Signup = (props) => {
  const {
    appBodyTheme,
    modalButtonRef,
    setUserId,
    setIsUserValid,
    showAlert,
    fetchInitialData,
  } = props;

  const [signupCredentials, setSignupCredentials] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [clearDataOptionChecked, setClearDataOptionChecked] = useState(false);

  function handleSignupCredentialsChange(event) {
    const { name, value } = event.target;
    setSignupCredentials({
      ...signupCredentials,
      [name]: value,
    });
  }

  /**
   * 
   * This function runs first time when a user registers. 
   * This function first checks whether password and confirm password are same, if not it shows an alert. If both are same then it checks whether a user is already registered or not. If user is not registered, addNewUser function defined in api.js is called which adds a new user details and make two default lists. 
   Then it calls getUserId function defined in api.js which gets user id, then set it in a variable.
   Finally, userValidity is set to true so that the user can see main application, then calls fetchInitialData defined in app.js to get a default page while window moves to main application.
   * @param {*} event 
   */
  async function handleUserSignUp(event) {
    event.preventDefault();
    const { email, username, password, confirmPassword } = signupCredentials;
    if (password === confirmPassword) {
      try {
        const response = await userRegistered(email);
        const isUserRegistered = response.data.registered;
        if (isUserRegistered === false) {
          await addNewUser(email, username, password);
          const response = await getUserId(email, username, password);
          const userId = response.data.userId;
          setUserId(userId);
          setIsUserValid(true);
          localStorage.setItem("userId", userId);
          await fetchInitialData(userId);
        } else {
          showAlert("warning", ": User with this email already exists.");
        }
      } catch (error) {
        modalButtonRef.current.click();
      }
    } else {
      showAlert("warning", ": Confirm password is different from password.");
    }
    setSignupCredentials({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  }

  /**
   * clears all the field data of signup form
   */
  function handleClearFormData() {
    setSignupCredentials({
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    setClearDataOptionChecked(true);
    setTimeout(() => {
      setClearDataOptionChecked(false);
    }, 500);
  }

  return (
    <form
      className={`register ${
        appBodyTheme === THEME.DARK.name
          ? THEME.DARK.className
          : THEME.LIGHT.className
      }`}
      onSubmit={handleUserSignUp}
    >
      <h4 className="text-center">Signup</h4>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          id="email"
          aria-describedby="emailHelp"
          placeholder="Email address"
          name="email"
          value={signupCredentials.email}
          onChange={handleSignupCredentialsChange}
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
          value={signupCredentials.username}
          onChange={handleSignupCredentialsChange}
          maxLength={30}
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
          value={signupCredentials.password}
          onChange={handleSignupCredentialsChange}
          required
          minLength={6}
          maxLength={30}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          id="confirm-password"
          placeholder="Confirm password"
          autoComplete="off"
          name="confirmPassword"
          value={signupCredentials.confirmPassword}
          onChange={handleSignupCredentialsChange}
          maxLength={30}
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
        Register
      </button>
    </form>
  );
};

export default Signup;
