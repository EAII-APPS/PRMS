import {jwtDecode} from "jwt-decode";
import Constants from "../lib/constants";
import CookieUtil from "./cookieUtil";
import moment from 'moment';

const is_date = (date) => {
  if (Object.prototype.toString.call(date) === "[object Date]") {
    return true;
  }
  return false;
};


const getTimeFromDate = (date) => {
  let dateObj = is_date(date) ? date : new Date(date);
  let hour = dateObj.getHours();
  let minute = dateObj.getMinutes();
  let meridian = "am";
  if (hour > 12) {
    hour -= 12;
    meridian = "pm";
  }
  if (hour === 0) {
    hour = 12;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  const timeString = hour + ":" + minute + " " + meridian;

  // Additional functionality to return relative date
  const messageMoment = moment(date);
  const now = moment();
  let relativeDate;
  if (messageMoment.isSame(now, 'day')) {
    relativeDate = "Today";
  } else if (messageMoment.isSame(now.subtract(1, 'day'), 'day')) {
    relativeDate = "Yesterday";
  } else {
    relativeDate = messageMoment.format('MMMM D');
  }

  return { timeString, relativeDate };
};

const getUserId = () => {
  let token = localStorage.getItem(Constants.ACCESS_PROPERTY); // Updated to use local storage
  if (token) {
    let decodedToken = jwtDecode(token);
    return decodedToken.user_id;
  }
  return "";
};

const getFormatedChatUser = (chatUsers, onlineUserList, lastSeenData) => {
  const userId = getUserId();
  if (!Array.isArray(chatUsers)) {
    console.error("chatUsers is not an array:", chatUsers);
    return [];
  }

  return chatUsers.reduce((accumulator, item) => {
    if (item.type === "DM" || item.type === "SELF") {
      let newResult = {};
      newResult["roomId"] = item.roomId;
      let member = null;
      for (let user of item.member) {
        if (user.id !== userId || item.type === "SELF") {
          member = user;
        }
      }
      if (member) {
        newResult["name"] = member.first_name + " " + member.last_name;
        newResult["image"] = member.photo;
        newResult["id"] = member.id;
        
        const lastSeenTime = lastSeenData[member.id];
        
        if (lastSeenTime) {
          const lastSeenMoment = moment(lastSeenTime);
          const now = moment();
          const diffInMinutes = now.diff(lastSeenMoment, 'minutes');

          if (diffInMinutes < 1) {
            newResult["isOnline"] = true;
            newResult["lastSeen"] = "Online";
          } else {
            newResult["isOnline"] = false;
            newResult["lastSeen"] = lastSeenMoment.fromNow();
          }
        } else {
          newResult["isOnline"] = false;
          newResult["lastSeen"] = "Offline";
        }
      }
      accumulator.push(newResult);
      return accumulator;
    }
    return accumulator;
  }, []);
};


const getActiveChatId = (match) => {
  const chatId = match && match ? match : null;
  console.log("Active Chat ID:", chatId); // Debugging line
  return chatId;
};

const CommonUtil = {
  getTimeFromDate: getTimeFromDate,
  getUserId: getUserId,
  getFormatedChatUser: getFormatedChatUser,
  getActiveChatId: getActiveChatId,
};

export default CommonUtil;
