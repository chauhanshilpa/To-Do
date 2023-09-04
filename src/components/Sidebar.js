import React from "react";
import { Link } from "react-router-dom";
import SidebarList from "./SidebarList";

const Sidebar = (props) => {
  const {
    appBodyTheme,
    sidebarOpenState,
    handlePredefinedListUuid,
    sidebarTaskListName,
    handleSidebarListChange,
    handleNewSidebarList,
    sidebarDynamicList,
    onClickingSidebarList,
    handleSidebarDynamicListDeletion,
  } = props;

  return (
    <>
      <div
        className={`sidebar d-flex flex-column p-3 bg-body-tertiary ${
          sidebarOpenState && "open-sidebar"
        } ${appBodyTheme === "dark" && "theme-dark"}`}
        data-bs-scroll="true"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <ul className="nav nav-pills flex-column mb-auto">
          <div className="predefined-lists" onClick={handlePredefinedListUuid}>
            <div id="home-tasks">
              <li>
                <Link
                  to="/my_day"
                  className="anchors nav-link link-body-emphasis"
                >
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
            </div>
            <div id="recycle-bin">
              <li>
                <Link
                  to="/recycle_bin"
                  className="anchors nav-link link-body-emphasis"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-recycle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242-2.532-4.431zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24l2.552-4.467zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.498.498 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244l-1.716-3.004z" />
                  </svg>
                  Recycle Bin
                </Link>
              </li>
            </div>
          </div>
          <div className="sidebar-input-field input-group flex-nowrap">
            <input
              type="text"
              className="form-control"
              placeholder="&#x2b; Add list name"
              aria-label="Add List"
              aria-describedby="addon-wrapping"
              onChange={handleSidebarListChange}
              onKeyDown={handleNewSidebarList}
              value={sidebarTaskListName}
            />
          </div>
          <div className="dynamic-lists">
            {sidebarDynamicList.map((list, listIndex) => (
              <SidebarList
                key={listIndex}
                listIndex={listIndex}
                path={list.uuid}
                listName={list.name}
                onClickingSidebarList={onClickingSidebarList}
                handleSidebarDynamicListDeletion={
                  handleSidebarDynamicListDeletion
                }
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
