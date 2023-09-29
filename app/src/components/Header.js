import React from "react";

const Header = (props) => {
  const { appBodyTheme, sidebarOpenState, toggleSidebarOpenState, listName } =
    props;

  return (
    <>
      <div
        className={`tasksToolbar-heading ${
          sidebarOpenState && "open-sidebar"
        } ${appBodyTheme === "dark" && "theme-dark"}`}
      >
        <div className="container" onClick={toggleSidebarOpenState}>
          <svg
            style={{ color: appBodyTheme === "dark" && "#eeeeee" }}
            className="fluentIcon ___12fm75w f1w7gpdv fez10in fg4l7m0"
            fill="currentColor"
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            onClick={toggleSidebarOpenState}
          >
            <path
              d="M2 4.5c0-.28.22-.5.5-.5h15a.5.5 0 010 1h-15a.5.5 0 01-.5-.5zm0 5c0-.28.22-.5.5-.5h15a.5.5 0 010 1h-15a.5.5 0 01-.5-.5zm.5 4.5a.5.5 0 000 1h15a.5.5 0 000-1h-15z"
              fill="currentColor"
            ></path>
          </svg>
          <h4 style={{ color: appBodyTheme === "dark" && "#eeeeee" }}>
            {listName}
          </h4>
        </div>
      </div>
    </>
  );
};

export default Header;
