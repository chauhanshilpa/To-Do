import React from "react";
import { Link } from "react-router-dom";
import SidebarList from "./SidebarList";

const Sidebar = (props) => {
  const {
    handleNewSidebarList,
    handleSidebarListChange,
    sidebarListName,
    sidebarList,
    onClickingSidebarList,
    sidebarListUuids,
    toggleSidebarOpenState,
    sidebarOpenState,
  } = props;

  return (
    <>
      <div
        className={`sidebar d-flex flex-column p-3 bg-body-tertiary ${
          sidebarOpenState && "open-sidebar"
        }`}
        data-bs-scroll="true"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="sidebar-header">
          <div className="close-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
              onClick={toggleSidebarOpenState}
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
          </div>
          <hr />
        </div>
        <ul className="nav nav-pills flex-column mb-auto home-list">
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
              My Day
            </Link>
          </li>
          <div className="sidebar-input-feild input-group flex-nowrap">
            <input
              type="text"
              className="form-control"
              placeholder="&#x2b; Add list name"
              aria-label="Add List"
              aria-describedby="addon-wrapping"
              onChange={handleSidebarListChange}
              onKeyDown={handleNewSidebarList}
              value={sidebarListName}
            />
          </div>
          <div className="sidebar-list">
            {sidebarList.map((listName, index) => (
              <SidebarList
                key={index}
                index={index}
                listName={listName}
                onClickingSidebarList={onClickingSidebarList}
                sidebarListUuids={sidebarListUuids}
              />
            ))}
          </div>
        </ul>
        <hr />
      </div>
    </>
  );
};

export default Sidebar;
