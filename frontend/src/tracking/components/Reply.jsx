import { useEffect, useState } from "react";
import useApi from "../hook/UseAuth";

const Reply = ({ reply, commentId, trackId, onDelete, onEdit }) => {
  const { getUserId } = useApi();
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(reply.content);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const id = getUserId();
      setUserId(id);
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
  }, [getUserId]);

  const handleEdit = () => {
    if (editText.trim() !== "") {
      onEdit(editText);
      setEditMode(false);
    }
  };
  const canEditOrDelete = reply.user === userId;

  return (
    <div
      className={`p-2 border rounded bg-gray-100 ${
        reply.user === userId ? "self-start" : "self-end"
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
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p>{reply.content}</p>
          <button
            className="text-blue-500 text-sm mt-2 mr-2"
            onClick={() => setEditMode(true)}
            disabled={!canEditOrDelete}
          >
            Edit
          </button>
          <button
            className="text-red-500 text-sm mt-2"
            onClick={onDelete}
            disabled={!canEditOrDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Reply;
