import { useState, useEffect } from "react";
import useApi from "../hook/UseAuth";
import Reply from "./Reply";

const Comment = ({
  comment,
  trackId,
  onReply,
  onDelete,
  onEdit,
  onDeleteReply,
  onEditReply,
}) => {
  const { getUserId } = useApi();
  const [newReply, setNewReply] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [replies, setReplies] = useState(comment.replies || []);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const id = getUserId();
      setUserId(id);
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
  }, [getUserId]);
  const handleReply = () => {
    if (newReply.trim() !== "") {
      onReply(comment.id, newReply);
      setNewReply("");
      setShowReply(false);
    }
  };

  const handleEdit = () => {
    if (editText.trim() !== "") {
      onEdit(comment.id, editText);
      setEditMode(false);
    }
  };

  useEffect(() => {
    setReplies(comment.replies || []);
  }, [comment]);

  const canEditOrDelete = comment.user === userId;

  return (
    <div
      className={`p-2 border rounded ${
        comment.user === userId
          ? "bg-gray-100 self-start"
          : "bg-gray-400 self-end"
      }`}
    >
      {editMode ? (
        <div>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows="2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleEdit}
          >
            Save
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditMode(false);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p>{comment.content}</p>
          <button
            className="text-blue-500 text-sm mt-2 mr-2"
            onClick={() => setEditMode(true)}
            disabled={!canEditOrDelete}
          >
            Edit
          </button>
          <button
            className="text-red-500 text-sm mt-2"
            onClick={() => onDelete(comment.id)}
            disabled={!canEditOrDelete}
          >
            Delete
          </button>
        </div>
      )}
      <button
        className="text-blue-500 text-sm mt-2"
        onClick={() => setShowReply(!showReply)}
      >
        Reply
      </button>
      {showReply && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows="2"
            placeholder="Write a reply..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleReply}
          >
            Send
          </button>
        </div>
      )}
      <div
        className={`mt-2 pl-4 border-l space-y-2 h-[100px] overflow-y-scroll ${
          comment.user === userId ? "border-l-blue-500" : "border-l-gray-500"
        }`}
      >
        {replies.map((reply, index) => (
          <Reply
            key={index}
            reply={reply}
            commentId={comment.id}
            trackId={trackId}
            onDelete={() => onDeleteReply(comment.id, reply.id)}
            onEdit={(newText) => onEditReply(comment.id, reply.id, newText)}
          />
        ))}
      </div>
    </div>
  );
};

export default Comment;
