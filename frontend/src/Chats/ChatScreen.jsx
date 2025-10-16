import React, { useEffect, useState, useRef } from "react";
import './chat.css';
import ApiConnector from "../api/apiConnector";
import ApiEndpoints from "../api/apiEndpoints";
import ServerUrl from "../api/serverUrl";
import Constants from "../lib/constants";
import SocketActions from "../lib/socketActions";
import CommonUtil from "../util/commonUtil";
import moment from 'moment';

const ChatScreen = ({ onclose, match, currentChattingMember, setOnlineUserList }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState({ results: [] });
  const [typing, setTyping] = useState(false);
  const [lastSeen, setLastSeen] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const loggedInUserId = CommonUtil.getUserId();

  const initializeWebSocket = () => {
    socketRef.current = new WebSocket(
      ServerUrl.WS_BASE_URL + `ws/users/${loggedInUserId}/chat/`
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
      const chatId = CommonUtil.getActiveChatId(match);
      const userId = CommonUtil.getUserId();
      if (chatId === data.roomId) {
        if (data.action === SocketActions.MESSAGE) {
          data["userImage"] = ServerUrl.BASE_URL.slice(0, -1) + data.userImage;
          setMessages((prevState) => ({
            ...prevState,
            results: [...prevState.results, data], // Append new message at the end
          }));
          setTyping(false);
          scrollToBottom();
        } else if (data.action === SocketActions.TYPING && data.user !== userId) {
          setTyping(data.typing);
        }
      }
      if (data.action === SocketActions.ONLINE_USER) {
        setOnlineUserList(data.userList);
      }
    };
  };

  useEffect(() => {
    initializeWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close(); // Close the WebSocket connection when component unmounts
      }
    };
  }, [match]);

  useEffect(() => {
    const fetchChatMessage = async () => {
      const currentChatId = CommonUtil.getActiveChatId(match);
      if (currentChatId) {
        const url =
          ApiEndpoints.CHAT_MESSAGE_URL.replace(
            Constants.CHAT_ID_PLACE_HOLDER,
            currentChatId
          ) + "?limit=20&offset=0";
        const chatMessages = await ApiConnector.sendGetRequest(url);
        setMessages({
          ...chatMessages,
          results: chatMessages.results.reverse(), // Reverse the fetched messages
        });
        scrollToBottom();
      }
    };

    fetchChatMessage();
  }, [match]);

  useEffect(() => {
    const fetchLastSeen = async () => {
      const url = `comApp/users/last_seen/${currentChattingMember.id}/`;
      const response = await ApiConnector.sendGetRequest(url);
      const lastSeenTime = response.last_seen;

      if (lastSeenTime){
      // Calculate the time difference
        const lastSeenMoment = moment(lastSeenTime);
        const now = moment();
        const diffInMinutes = now.diff(lastSeenMoment, 'minutes');

        if (diffInMinutes < 1) {
          setLastSeen("Online");
          // currentChattingMember.isOnline = true;
        } else {
          setLastSeen('Last seen: '+lastSeenMoment.fromNow());
          // currentChattingMember.isOnline = false;
        }
      }
      else{
        setLastSeen("Offline");
      }
    };
    
    fetchLastSeen();
  }, [currentChattingMember]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const messageSubmitHandler = (event) => {
    event.preventDefault();
    if (inputMessage) {
      socketRef.current.send(
        JSON.stringify({
          action: SocketActions.MESSAGE,
          message: inputMessage,
          user: loggedInUserId,
          roomId: CommonUtil.getActiveChatId(match),
        })
      );
      setInputMessage("");
    }
  };

  let typingTimer = 0;
  let isTypingSignalSent = false;

  const sendTypingSignal = (typing) => {
    socketRef.current.send(
      JSON.stringify({
        action: SocketActions.TYPING,
        typing: typing,
        user: loggedInUserId,
        roomId: CommonUtil.getActiveChatId(match),
      })
    );
  };
  function getInitial(firstName, lastName) {
    // Fallback to an empty string if either name is null or undefined
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  
    // Combine the initials and return
    return `${firstInitial}${lastInitial}`;
  }
  const chatMessageTypingHandler = (event) => {
    if (event.keyCode !== Constants.ENTER_KEY_CODE) {
      if (!isTypingSignalSent) {
        sendTypingSignal(true);
        isTypingSignalSent = true;
      }
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        sendTypingSignal(false);
        isTypingSignalSent = false;
      }, 3000);
    } else {
      clearTimeout(typingTimer);
      isTypingSignalSent = false;
    }
  };
  
  const getChatMessageClassName = (userId) => {
    return loggedInUserId === userId
      ? "chat-message chat-message-right justify-center self-end px-3 py-2 mt-3.5 bg-indigo-500 rounded-xl shadow-sm text-white"
      : "chat-message chat-message-left justify-center px-3 py-2 mt-7 leading-5 text-gray-900 bg-white rounded-xl shadow-sm";
  };

  return (
    <div className="flex flex-col bg-white">
      <header className="flex gap-4 py-8 pr-20 pl-6 bg-white">
        <button onClick={onclose}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a10d6885e0480824dc75cf2a2dbaf6d5cdbd38571ca351afeda7c8ec977bfa7?apiKey=3061b615d14b47beba1c5888fe8aa383&"
            alt="Back arrow icon"
            className="shrink-0 my-auto w-5 aspect-square"
          />
        </button>
  
        <div className="flex gap-2">
          {currentChattingMember.image ?(
          <img
            src={currentChattingMember.image}
            alt={currentChattingMember.name}
            className="shrink-0 w-11 rounded-full aspect-square"
          />
          ):(
            <div className="bg-gray-700 rounded-full w-9 text-center h-9 p-2 mr-2 text-white font-extrabold">{getInitial(currentChattingMember.name,null)}</div>
          )}
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold tracking-tight leading-5 text-gray-900">
              {currentChattingMember?.name}
            </h2>
            <div className="flex gap-2 mt-1.5">
              <div className="flex flex-col justify-center px-0.5 py-1.5">
                <div className="shrink-0 w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
              <div className="text-xs font-medium tracking-tight text-gray-900">
                <div className="small">
                  <span className={`status-circle ${lastSeen === 'Online' ? 'online' : 'offline'}`}></span>
                  {lastSeen ? lastSeen : "Offline"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex flex-col px-6 mt-1.5 w-full text-sm font-medium tracking-tight leading-5 text-white bg-blue-gray-50 border-t-2">
        <div className="chatcard">
          <div id="chat-message-container" className="chat-messages">
            {messages?.results?.map((message, index) => {
              const { timeString, relativeDate } = CommonUtil.getTimeFromDate(message.timestamp);
              return (
                <div key={index} id="chatuser" className={getChatMessageClassName(message.user)}>
                  <div className="chat-message-content">
                    {message.message}
                  </div>
                  <div className="text-muted small text-nowrap mt-2">
                      {relativeDate} at {timeString}
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="chat-message-left chat-bubble mb-1">
                <div className="typing">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>
      <footer className="flex flex-col pb-3.5 mt-4 w-full bg-white">
        <div className="w-full bg-neutral-100 border-neutral-100 min-h-[1px]" />
        <form onSubmit={messageSubmitHandler} className="flex gap-10 self-center px-5 mt-3.5 w-full max-w-[367px]">
          <input
            onChange={(event) => setInputMessage(event.target.value)}
            onKeyUp={chatMessageTypingHandler}
            value={inputMessage}
            size="lg"
            type="text"
            placeholder="Send your message"
            className="border-none focus:outline-none w-full"
          />
          <div className="flex gap-5">
            <button
              type="submit"
              className="flex justify-center items-center w-7 h-7 bg-indigo-500 rounded-xl"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/70e935e08fc5ab8ec70d55d0b4955f816b9e12c6a9eb58fa69267401abb9c8de?apiKey=3061b615d14b47beba1c5888fe8aa383&"
                alt="Send icon"
                className="w-6 aspect-square"
              />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
  
};

export default ChatScreen;
