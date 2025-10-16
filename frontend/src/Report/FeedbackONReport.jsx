import { useState, useEffect } from "react";
import useApi from "../tracking/hook/UseAuth";
import { useAuth } from "../GlobalContexts/Auth-Context";

const FeedBackOnReport = ({ divisionData = [], sectorData = [] }) => {
  const { get, post, put, del, getUserId } = useApi();
  const authInfo = useAuth();
  const userPermissions = authInfo.user.userPermissions;
  const [userId, setUserId] = useState(null);

  const hascreateAssignMainAndReadAssign =
    userPermissions.includes("createAssignMain") &&
    userPermissions.includes("readAssign");

  const hasCreateAssignOnly =
    userPermissions.includes("createAssign") &&
    !hascreateAssignMainAndReadAssign;

  const [selection, setSelection] = useState(
    hascreateAssignMainAndReadAssign ? "me" : "sector"
  );
  const [options, setOptions] = useState(
    hascreateAssignMainAndReadAssign ? divisionData : sectorData
  );
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [replyContent, setReplyContent] = useState({});

  useEffect(() => {
    fetchComments();
  }, [selection, selectedOption]);

  useEffect(() => {
    try {
      const id = getUserId();
      setUserId(id);
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
  }, [getUserId]);

  const handleSelectionChange = (e) => {
    if (hascreateAssignMainAndReadAssign) {
      const { value } = e.target;
      setSelection(value);

      if (value === "division") {
        setOptions(divisionData);
        setSelectedOption(divisionData[0]);
      } else {
        setOptions([]);
        setSelectedOption(null);
      }
    }
  };

  const handleOptionChange = (e) => {
    if (
      hasCreateAssignOnly ||
      (hascreateAssignMainAndReadAssign && selection === "division")
    ) {
      const selectedId = e.target.value;
      const selectedOption = options.find(
        (option) => option.id === parseInt(selectedId)
      );
      setSelectedOption(selectedOption);
    }
  };

  const fetchComments = async () => {
    let apiUrl;
    if (
      userPermissions.includes("createKpiTrack") &&
      !userPermissions.includes("readAssign")
    ) {
      apiUrl = `/tracking/feedbackOnreport/division/${authInfo.user.division_id}/comments/`;
    } else if (hascreateAssignMainAndReadAssign) {
      if (selection === "me") {
        apiUrl = `/tracking/feedbackOnreport/sector/${authInfo.user.sector_id}/comments/`;
      } else {
        apiUrl = `/tracking/feedbackOnreport/division/${selectedOption.id}/comments/`;
      }
    } else if (hasCreateAssignOnly) {
      apiUrl = `/tracking/feedbackOnreport/sector/${selectedOption.id}/comments/`;
    }

    try {
      const response = await get(apiUrl);
      const fetchedComments = (response || []).map((comment) => ({
        ...comment,
        replies: comment.replies || [],
        isEditing: false,
        showReply: false,
      }));
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSendComment = async () => {
    let apiUrl;
    if (
      userPermissions.includes("createKpiTrack") &&
      !userPermissions.includes("readAssign")
    ) {
      apiUrl = `/tracking/feedbackOnreport/division/${authInfo.user.division_id}/comments/`;
    } else if (hascreateAssignMainAndReadAssign) {
      if (selection === "me") {
        apiUrl = `/tracking/feedbackOnreport/sector/${authInfo.user.sector_id}/comments/`;
      } else {
        apiUrl = `/tracking/feedbackOnreport/division/${selectedOption.id}/comments/`;
      }
    } else if (hasCreateAssignOnly) {
      apiUrl = `/tracking/feedbackOnreport/sector/${selectedOption.id}/comments/`;
    }

    const data = { content: comment };

    try {
      const response = await post(apiUrl, data);
      setComments([
        ...comments,
        {
          id: response.id,
          content: comment,
          replies: [],
          isEditing: false,
          showReply: false,
        },
      ]);
      setComment("");
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };

  const handleSendReply = async (commentIndex) => {
    const reply = replyContent[commentIndex];
    if (!reply) return;

    let apiUrl;
    if (
      userPermissions.includes("createKpiTrack") &&
      !userPermissions.includes("readAssign")
    ) {
      apiUrl = `/tracking/feedbackOnreport/division/${authInfo.user.division_id}/comments/${comments[commentIndex]?.id}/replies/`;
    } else if (hascreateAssignMainAndReadAssign) {
      if (selection === "me") {
        apiUrl = `/tracking/feedbackOnreport/sector/${authInfo.user.sector_id}/comments/${comments[commentIndex]?.id}/replies/`;
      } else {
        apiUrl = `/tracking/feedbackOnreport/division/${selectedOption.id}/comments/${comments[commentIndex]?.id}/replies/`;
      }
    } else if (hasCreateAssignOnly) {
      apiUrl = `/tracking/feedbackOnreport/sector/${selectedOption.id}/comments/${comments[commentIndex]?.id}/replies/`;
    }

    const data = { content: reply };

    try {
      const response = await post(apiUrl, data);
      const updatedComments = comments.map((comment, index) => {
        if (index === commentIndex) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: response.id,
                content: reply,
                isEditing: false,
                showReply: false,
                replies: [],
              },
            ],
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyContent({ ...replyContent, [commentIndex]: "" });
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleDeleteComment = async (commentIndex) => {
    let apiUrl;
    if (
      userPermissions.includes("createKpiTrack") &&
      !userPermissions.includes("readAssign")
    ) {
      apiUrl = `/tracking/feedbackOnreport/division/${authInfo.user.division_id}/comments/${comments[commentIndex]?.id}/`;
    } else if (hascreateAssignMainAndReadAssign) {
      if (selection === "me") {
        apiUrl = `/tracking/feedbackOnreport/sector/${authInfo.user.sector_id}/comments/${comments[commentIndex]?.id}/`;
      } else {
        apiUrl = `/tracking/feedbackOnreport/division/${selectedOption.id}/comments/${comments[commentIndex]?.id}/`;
      }
    } else if (hasCreateAssignOnly) {
      apiUrl = `/tracking/feedbackOnreport/sector/${selectedOption.id}/comments/${comments[commentIndex]?.id}/`;
    }

    try {
      await del(apiUrl);
      const updatedComments = comments.filter(
        (_, index) => index !== commentIndex
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteReply = async (commentIndex, replyIndex) => {
    let apiUrl;
    if (
      userPermissions.includes("createKpiTrack") &&
      !userPermissions.includes("readAssign")
    ) {
      apiUrl = `/tracking/feedbackOnreport/division/${authInfo.user.division_id}/comments/${comments[commentIndex]?.id}/replies/${comments[commentIndex]?.replies[replyIndex]?.id}/`;
    } else if (hascreateAssignMainAndReadAssign) {
      if (selection === "me") {
        apiUrl = `/tracking/feedbackOnreport/sector/${authInfo.user.sector_id}/comments/${comments[commentIndex]?.id}/replies/${comments[commentIndex]?.replies[replyIndex]?.id}/`;
      } else {
        apiUrl = `/tracking/feedbackOnreport/division/${selectedOption.id}/comments/${comments[commentIndex]?.id}/replies/${comments[commentIndex]?.replies[replyIndex]?.id}/`;
      }
    } else if (hasCreateAssignOnly) {
      apiUrl = `/tracking/feedbackOnreport/sector/${selectedOption.id}/comments/${comments[commentIndex]?.id}/replies/${comments[commentIndex]?.replies[replyIndex]?.id}/`;
    }

    try {
      await del(apiUrl);
      const updatedComments = comments.map((comment, index) => {
        if (index === commentIndex) {
          return {
            ...comment,
            replies: comment.replies.filter((_, i) => i !== replyIndex),
          };
        }
        return comment;
      });
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const handleEditComment = async (commentIndex, newText) => {
    let apiUrl;
    if (
      userPermissions.includes("createKpiTrack") &&
      !userPermissions.includes("readAssign")
    ) {
      apiUrl = `/tracking/feedbackOnreport/division/${authInfo.user.division_id}/comments/${comments[commentIndex]?.id}/`;
    } else if (hascreateAssignMainAndReadAssign) {
      if (selection === "me") {
        apiUrl = `/tracking/feedbackOnreport/sector/${authInfo.user.sector_id}/comments/${comments[commentIndex]?.id}/`;
      } else {
        apiUrl = `/tracking/feedbackOnreport/division/${selectedOption.id}/comments/${comments[commentIndex]?.id}/`;
      }
    } else if (hasCreateAssignOnly) {
      apiUrl = `/tracking/feedbackOnreport/sector/${selectedOption.id}/comments/${comments[commentIndex]?.id}/`;
    }

    const data = { content: newText };

    try {
      await put(apiUrl, data);
      const updatedComments = comments.map((comment, index) => {
        if (index === commentIndex) {
          return { ...comment, content: newText, isEditing: false };
        }
        return comment;
      });
      setComments(updatedComments);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleEditReply = async (commentIndex, replyIndex, newText) => {
    let apiUrl;
    if (
      userPermissions.includes("createKpiTrack") &&
      !userPermissions.includes("readAssign")
    ) {
      apiUrl = `/tracking/feedbackOnreport/division/${authInfo.user.division_id}/comments/${comments[commentIndex]?.id}/replies/${comments[commentIndex]?.replies[replyIndex]?.id}/`;
    } else if (hascreateAssignMainAndReadAssign) {
      if (selection === "me") {
        apiUrl = `/tracking/feedbackOnreport/sector/${authInfo.user.sector_id}/comments/${comments[commentIndex]?.id}/replies/${comments[commentIndex]?.replies[replyIndex]?.id}/`;
      } else {
        apiUrl = `/tracking/feedbackOnreport/division/${selectedOption.id}/comments/${comments[commentIndex]?.id}/replies/${comments[commentIndex]?.replies[replyIndex]?.id}/`;
      }
    } else if (hasCreateAssignOnly) {
      apiUrl = `/tracking/feedbackOnreport/sector/${selectedOption.id}/comments/${comments[commentIndex]?.id}/replies/${comments[commentIndex]?.replies[replyIndex]?.id}/`;
    }

    const data = { content: newText };

    try {
      await put(apiUrl, data);
      const updatedComments = comments.map((comment, index) => {
        if (index === commentIndex) {
          return {
            ...comment,
            replies: comment.replies.map((reply, i) => {
              if (i === replyIndex) {
                return { ...reply, content: newText, isEditing: false };
              }
              return reply;
            }),
          };
        }
        return comment;
      });
      setComments(updatedComments);
    } catch (error) {
      console.error("Error editing reply:", error);
    }
  };

  const toggleEditComment = (commentIndex) => {
    const updatedComments = comments.map((comment, index) => {
      if (index === commentIndex) {
        return { ...comment, isEditing: !comment.isEditing };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const toggleEditReply = (commentIndex, replyIndex) => {
    const updatedComments = comments.map((comment, index) => {
      if (index === commentIndex) {
        return {
          ...comment,
          replies: comment.replies.map((reply, i) => {
            if (i === replyIndex) {
              return { ...reply, isEditing: !reply.isEditing };
            }
            return reply;
          }),
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const toggleReplyComment = (commentIndex) => {
    const updatedComments = comments.map((comment, index) => {
      if (index === commentIndex) {
        return { ...comment, showReply: !comment.showReply };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  return (
    <div className="p-4 w-[803.4px]  max-w-2xl mx-auto">
      {hascreateAssignMainAndReadAssign && (
        <div className="flex mb-4">
          <label className="mr-4">
            <input
              type="radio"
              name="selection"
              value="me"
              checked={selection === "me"}
              onChange={handleSelectionChange}
              className="mr-2"
            />
            <span>Me</span>
          </label>
          <label>
            <input
              type="radio"
              name="selection"
              value="division"
              checked={selection === "division"}
              onChange={handleSelectionChange}
              className="mr-2"
            />
            <span>Division</span>
          </label>
        </div>
      )}
      {(hasCreateAssignOnly ||
        (hascreateAssignMainAndReadAssign && selection === "division")) &&
        options.length > 0 && (
          <select
            value={selectedOption?.id || ""}
            onChange={handleOptionChange}
            className="mb-4 p-2 border rounded w-full"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        )}

      <div className="mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comment"
          className="w-full p-2 border rounded resize-none"
          rows="4"
        />
        <button
          onClick={handleSendComment}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
      <div className="h-[420px] overflow-y-auto">
        <div className="space-y-4">
          {comments.map((comment, commentIndex) => (
            <div key={comment.id} className="relative">
              <div className="ml-6 pb-4 border-l-2 border-gray-200">
                <div className="relative pt-4 pl-4">
                  <div className="absolute top-4 -left-[9px] w-4 h-4 bg-white border-2 border-gray-200 rounded-full"></div>

                  {comment.isEditing ? (
                    <div>
                      <textarea
                        value={comment.content}
                        onChange={(e) =>
                          setComments(
                            comments.map((c, i) =>
                              i === commentIndex
                                ? { ...c, content: e.target.value }
                                : c
                            )
                          )
                        }
                        className="w-full p-2 border rounded resize-none"
                        rows="4"
                      />
                      <button
                        onClick={() =>
                          handleEditComment(commentIndex, comment.content)
                        }
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => toggleEditComment(commentIndex)}
                        className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-lg">{comment.content}</p>
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => toggleReplyComment(commentIndex)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                          {comment.showReply ? "Close Reply" : "Reply"}
                        </button>
                        {userId === comment.user && (
                          <>
                            <button
                              onClick={() => toggleEditComment(commentIndex)}
                              className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(commentIndex)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Replies */}
                <div className="mt-4">
                  <div className="max-h-[200px] overflow-y-auto scrollbar-thin">
                    <div className=" space-y-4">
                      {comment.replies.map((reply, replyIndex) => (
                        <div key={reply.id} className="relative ml-8">
                          <div className="border-l-2 border-gray-100 pl-6 pb-4">
                            <div className="relative">
                              <div className="absolute top-0 -left-[9px] w-4 h-4 bg-white border-2 border-gray-100 rounded-full"></div>
                              {reply.isEditing ? (
                                <div>
                                  <textarea
                                    value={reply.content}
                                    onChange={(e) =>
                                      setComments(
                                        comments.map((c, i) =>
                                          i === commentIndex
                                            ? {
                                                ...c,
                                                replies: c.replies.map((r, j) =>
                                                  j === replyIndex
                                                    ? {
                                                        ...r,
                                                        content: e.target.value,
                                                      }
                                                    : r
                                                ),
                                              }
                                            : c
                                        )
                                      )
                                    }
                                    className="w-full p-2 border rounded resize-none"
                                    rows="3"
                                  />
                                  <button
                                    onClick={() =>
                                      handleEditReply(
                                        commentIndex,
                                        replyIndex,
                                        reply.content
                                      )
                                    }
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() =>
                                      toggleEditReply(commentIndex, replyIndex)
                                    }
                                    className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <p className="text-lg">{reply.content}</p>

                                  <div className="mt-2 space-x-2">
                                    {userId === reply.user && (
                                      <>
                                        <button
                                          onClick={() =>
                                            toggleEditReply(
                                              commentIndex,
                                              replyIndex
                                            )
                                          }
                                          className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteReply(
                                              commentIndex,
                                              replyIndex
                                            )
                                          }
                                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                                        >
                                          Delete
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reply input */}
                {comment.showReply && (
                  <div className="mt-4 ml-8">
                    <textarea
                      value={replyContent[commentIndex] || ""}
                      onChange={(e) =>
                        setReplyContent({
                          ...replyContent,
                          [commentIndex]: e.target.value,
                        })
                      }
                      placeholder="Add your reply"
                      className="w-full p-2 border rounded resize-none"
                      rows="3"
                    />
                    <button
                      onClick={() => handleSendReply(commentIndex)}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedBackOnReport;
