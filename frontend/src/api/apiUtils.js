import Constants from "../lib/constants";
import HttpStatusCode from "./httpStatusCodes";

const statusHandler = (response) => {
  return response.status === HttpStatusCode.OK ||
    response.status === HttpStatusCode.CREATED
    ? Promise.resolve(response)
    : Promise.reject(response);
};

const jsonHandler = (response) => {
  return response.json();
};

const getPostRequestHeader = () => {
  return {
    Accept: "application/json, text/plain",
    "Content-Type": "application/json; charset=UTF-8",
  };
};

const getAuthHeader = () => {
  const token = localStorage.getItem(Constants.ACCESS_PROPERTY);
  return token ? { Authorization: "Bearer " + token } : {};
};

const ApiUtils = {
  statusHandler: statusHandler,
  jsonHandler: jsonHandler,
  getPostRequestHeader: getPostRequestHeader,
  getAuthHeader: getAuthHeader,
};

export default ApiUtils;
