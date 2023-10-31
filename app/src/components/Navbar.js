import React from "react";
import { THEME } from "../Constants";
import { Link } from "react-router-dom";

/**
 *
 * @param {*} props
 * @returns navbar having a home screen link and a switch to switch between dark and light mode
 */
const Navbar = (props) => {
  const { handleLightAndDarkMode, appBodyTheme } = props;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <div className="nav-items">
            <Link className="navbar-brand" to="/">
              To Do
            </Link>
            <Link className="mx-2" to="/login">
              Log in
            </Link>
            <Link className="mx-2" to="/signup">
              Sign up
            </Link>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              onClick={handleLightAndDarkMode}
            />
            <label
              className="form-check-label text-white fw-light"
              htmlFor="flexSwitchCheckChecked"
            >
              {appBodyTheme === THEME.DARK.name ? "Light Mode" : "Dark Mode"}
            </label>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
