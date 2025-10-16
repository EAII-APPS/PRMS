import {jwtDecode} from "jwt-decode";
import Constants from "../lib/constants";

const getUserId = () => {
  const token = localStorage.getItem(Constants.ACCESS_PROPERTY);
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.user_id;
  }
  return null;
};

export default getUserId;
