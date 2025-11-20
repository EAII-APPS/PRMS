import React, { useEffect, useState, useRef } from "react";
import './chat.css';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import ChatScreen from "./ChatScreen";
import ApiEndpoints from "../api/apiEndpoints";
import ApiConnector from "../api/apiConnector";
import { Card, Input } from "@material-tailwind/react";
import Modal from "../components/modal/modal";
import CommonUtil from "../util/commonUtil";
import Constants from "../lib/constants";
import AppPaths from "../lib/appPaths";
import ServerUrl from "../api/serverUrl";

const MessageScreen = ({setUnreadCounts, markMessagesAsRead}) => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]); //popup users
  const [isShowAddPeopleModal, setIsShowAddPeopleModal] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [onlineUserList, setOnlineUserList] = useState([]);
  const [currentChattingMember, setCurrentChattingMember] = useState({});
  const [currentChatId, setCurrentChatId] = useState(null);
  const [lastSeenData, setLastSeenData] = useState({});
  const [unreadCounts, setLocalUnreadCounts] = useState({});
  const socketRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const openChatRoom = (chatUser) => {
    setCurrentChattingMember(chatUser);
    setCurrentChatId(chatUser.roomId);
    setShowModal(true); // Open the modal for the chat screen
  
    // Mark messages as read
    markMessagesAsRead(chatUser.roomId);

    // Remove unread count for the opened chat room
    setLocalUnreadCounts((prev) => ({
      ...prev,
      [chatUser.roomId]: 0,
    }));
  };

  const fetchUnreadCounts = async (chatUsers) => {
    const unreadCounts = {};
    for (const room of chatUsers) {
      const response = await ApiConnector.sendGetRequest(
        `comApp/chats/${room.roomId}/unread_count/`
      );
      unreadCounts[room.roomId] = response.unread_count;
    }
    return unreadCounts;
  };

  const redirectUserToDefaultChatRoom = (chatUsers) => {
    
    if (location.pathname === AppPaths.HOME) {
      openChatRoom(chatUsers[0]);
    } else {
      const activeChatId = CommonUtil.getActiveChatId(location.pathname);
      const chatUser = chatUsers.find((user) => user.roomId === activeChatId);
      if (chatUser) {
        openChatRoom(chatUser);
      }
    }
  };

  const fetchLastSeenData = async (chatUsers) => {
    const lastSeenData = {};
    for (const chatUser of chatUsers) {
      for (const user of chatUser.member) {
        if (!onlineUserList.includes(user.id)) {
          const response = await ApiConnector.sendGetRequest(`comApp/users/last_seen/${user.id}/`);
          lastSeenData[user.id] = response.last_seen;
        }
      }
    }
    return lastSeenData;
  };
  

  const fetchChatUser = async () => {
    const url = ApiEndpoints.USER_CHAT_URL.replace(
      Constants.USER_ID_PLACE_HOLDER,
      CommonUtil.getUserId()
    );
    const chatUsers = await ApiConnector.sendGetRequest(url);
    const lastSeenData = await fetchLastSeenData(chatUsers);
    const unreadCounts = await fetchUnreadCounts(chatUsers);
    const formattedChatUser = CommonUtil.getFormatedChatUser(
      chatUsers,
      onlineUserList,
      lastSeenData
    );
    setChatUsers(formattedChatUser);
    setLocalUnreadCounts(unreadCounts)
    setUnreadCounts(unreadCounts);
    redirectUserToDefaultChatRoom(formattedChatUser);
  };
  
  useEffect(() => {
    fetchChatUser();
  }, []);

  useEffect(() => {
    socketRef.current = new WebSocket(
      `${ServerUrl.WS_BASE_URL}ws/users/${CommonUtil.getUserId()}/chat/`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === 'message' && data.roomId !== currentChatId) {
        setLocalUnreadCounts((prev) => ({
          ...prev,
          [data.roomId]: (prev[data.roomId] || 0) + 1,
        }));
        setUnreadCounts((prev) => ({
          ...prev,
          [data.roomId]: (prev[data.roomId] || 0) + 1,
        }));
      }
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [currentChatId]);

  const addMemberClickHandler = async (memberId) => {
    const userId = CommonUtil.getUserId();
    const requestBody = {
      members: [memberId, userId],
      type: "DM",
    };
    await ApiConnector.sendPostRequest(
      ApiEndpoints.CHAT_URL,
      JSON.stringify(requestBody),
      true,
      false
    );
    fetchChatUser();
    setIsShowAddPeopleModal(false);
  };

  const fetchUsers = async () => {
    const url = ApiEndpoints.USER_URL;
    const users = await ApiConnector.sendGetRequest(url);
    setUsers(users);
  };

  const addPeopleClickHandler = async () => {
    await fetchUsers();
    setIsShowAddPeopleModal(true);
  };

  const getActiveChatClass = (roomId) => {
    return roomId === currentChatId ? "active-chat" : "";
  };

  const getChatListWithOnlineUser = () => {
    return chatUsers.map((user) => {
      user.isOnline = onlineUserList.includes(user.id);
      return user;
    });
  };

  useEffect(() => {
    if (!sessionStorage.getItem("pageRefreshed")) {
      sessionStorage.setItem("pageRefreshed", "true");
      window.location.reload();
    }
  }, []);
  
  function getInitial(firstName, lastName) {
    // Fallback to an empty string if either name is null or undefined
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  
    // Combine the initials and return
    return `${firstInitial}${lastInitial}`;
  }

  return (
    <div className="h-96 cardd" style={{width:"390px"}}>
      <div className="flex flex-col justify-center items-center bg-white w-full ">
        <header className="flex flex-col self-stretch px-6 pt-3 w-full bg-white">
          <div className="chat-head flex items-center justify-between">
            <h1 className="mt-5 text-2xl font-semibold tracking-tighter leading-9 text-gray-900 mb-5">
              Chats
            </h1>
            <button
              onClick={addPeopleClickHandler}
              className="btn bg-green-500 text-white my-1 mt-4"
              style={{ padding: '5px' }}
            >
              Add Friends
            </button>
          </div>
          <Input
            label="Search"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
        </header>
        <main
          className=" cursor-pointer flex flex-col justify-center mt-4 w-full rounded-xl bg-neutral-50 max-w-[352px]"
          style={{ width: '100%' }}
        >
          <div className="user-list-container">
            {getChatListWithOnlineUser()?.map((chatUser) => (
              <Card
                onClick={() => openChatRoom(chatUser)}
                className={
                  "pl-1 list-group-item list-group-item-action border-0 " +
                  getActiveChatClass(chatUser.roomId)
                }
                key={chatUser.id}
              >
                <div className="d-flex ddd align-items-start">
                  {chatUser.image ?(
                  <img
                    src={chatUser.image}
                    className="shrink-0 w-12 rounded-full aspect-square"
                    alt={chatUser.name}
                    width="40"
                    height="40"
                    
                  />
                  ):(
                    <div className="bg-gray-700 w-9 h-9 rounded-full p-2 mr-2 text-white text-center font-extrabold">{getInitial(chatUser.name,null)}</div>
                  )}

                  <div className="flex-grow-1 ml-3">
                    {chatUser.name}
                    {unreadCounts[chatUser.roomId] > 0 && (
                      <span className="badge badge-danger ml-2">
                        {unreadCounts[chatUser.roomId]}
                      </span>
                    )}  
                  </div>
                </div>
                <hr />
              </Card>
            ))}
          </div>
        </main>
      </div>
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm"
          style={{ width: '400px' }}
        >
          <Card
            onClick={handleModalClick}
            className="w-full h-full bg-white rounded-md"
          >
            <ChatScreen
              onclose={handleCloseModal}
              setOnlineUserList={setOnlineUserList}
              currentChattingMember={currentChattingMember}
              //match={{ params: { chatId: currentChatId } }}
              match={currentChatId}
            />
          </Card>
        </div>
      )}
      <Modal
        modalCloseHandler={() => setIsShowAddPeopleModal(false)}
        show={isShowAddPeopleModal}
        sx={{ width: "50%" }}
      >
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="horizontal-align">
              {user.photo ? (
              <img
                src={`http://196.188.240.102:4020${user.photo}`}
                className="rounded-circle"
                alt={`${user.first_name} ${user.last_name}`}
                width="40"
                height="40"
              />):(
                <div className="bg-gray-700 rounded-full w-9 h-9 p-2 mr-2 text-white font-extrabold">{getInitial(user.first_name,user.last_name)}</div>
              )}

              <div className="user-info">
                {user.first_name} {user.last_name}
              </div>
              <button
                onClick={() => addMemberClickHandler(user.id)}
                className="add-btn btn-sm btn-success mr-2"
              >
                Add
              </button>
            </div>
          ))
        ) : (
          <h3>No More User Found</h3>
        )}
      </Modal>
    </div>
  );
};

export default MessageScreen;
