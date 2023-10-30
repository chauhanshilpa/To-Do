// backend localhost is 4002
export const BASE_URL = "http://localhost:4002";

export const ENTER_KEY_CODE = 13;

/******************As for now DEFAULT_LIST and  RECYCLE_BIN_LIST pathName are hard coded into database but later it will be taken for every new user****************************************/

export const DEFAULT_LIST = {
  id: "557e1292-e14f-43d4-a466-448923480365",
  name: "My Day",
};

export const RECYCLE_BIN_LIST = {
  id: "557e1292-e14f-43d4-a466-548923480335",
  name: "Recycle Bin",
};
/************************************************************* */

export const THEME = {
  LIGHT: {
    name: "light",
    backgroundColor: "#FFFFFF",
    className: "theme-light",
  },
  DARK: {
    name: "dark",
    backgroundColor: "#343A40",
    className: "theme-dark",
  },
};
