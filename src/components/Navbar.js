import React from "react";
import { Link } from "react-router-dom";

const Navbar = (props) => {
  const { handleLightAndDarkMode } = props;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            To Do
          </Link>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              onClick={handleLightAndDarkMode}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
