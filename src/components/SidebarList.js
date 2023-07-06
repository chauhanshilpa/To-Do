import React from "react";
import { Link } from "react-router-dom";

const SidebarList = (props) => {
  const { listName, onClickingSidebarList } = props;

  return (
    <li onClick={() => onClickingSidebarList(listName)}>
      <Link to={`/${listName}`} className="nav-link link-body-emphasis">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-list-ul"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
          />
        </svg>
        {listName}
      </Link>
    </li>
  );
};

export default SidebarList;
