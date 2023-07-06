import React from "react";
import { Link } from "react-router-dom";
import SidebarList from "./SidebarList";

const Sidebar = (props) => {
  const {
    handleSidebarListKeypress,
    handleSidebarListName,
    sidebarListName,
    sidebarList,
    onClickingSidebarList,
  } = props;

  return (
    <>
      <div
        className="sidebar offcanvas offcanvas-start d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
        data-bs-scroll="true"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <Link to="/" className="nav-link link-body-emphasis">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-house-door"
                viewBox="0 0 16 16"
              >
                <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146ZM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5Z" />
              </svg>
              Tasks
            </Link>
          </li>
          <div className="input-group flex-nowrap">
            <input
              type="text"
              className="form-control"
              placeholder="&#x2b; Add List"
              aria-label="Add List"
              aria-describedby="addon-wrapping"
              onChange={handleSidebarListName}
              onKeyDown={handleSidebarListKeypress}
              value={sidebarListName}
            />
          </div>
          {sidebarList.map((listName, index) => (
            <SidebarList
              key={index}
              listName={listName}
              onClickingSidebarList={onClickingSidebarList}
            />
          ))}
        </ul>
        <hr />
      </div>
    </>
  );
};

export default Sidebar;
