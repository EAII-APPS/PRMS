import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Comment from "./Comment";
import useApi from "../hook/UseAuth";

const CommentCard = ({ trackId }) => {
  const [comments, setComments] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const { get, post, put, del } = useApi();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await get(`tracking/feedback/${trackId}/comments/`);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [trackId]);

  const addComment = async (data) => {
    try {
      const newComment = await post(`tracking/feedback/${trackId}/comments/`, {
        content: data.comment,
      });
      setComments([...comments, newComment]);
      reset();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await del(`tracking/feedback/${trackId}/comments/${commentId}/`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const editComment = async (commentId, newText) => {
    try {
      const updatedComment = await put(
        `tracking/feedback/${trackId}/comments/${commentId}/`,
        { content: newText }
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const addReply = async (commentId, replyText) => {
    try {
      const newReply = await post(
        `tracking/feedback/${trackId}/comments/${commentId}/replies/`,
        { content: replyText }
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const deleteReply = async (commentId, replyId) => {
    try {
      await del(
        `tracking/feedback/${trackId}/comments/${commentId}/replies/${replyId}/`
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply.id !== replyId
                ),
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const editReply = async (commentId, replyId, newText) => {
    try {
      const updatedReply = await put(
        `tracking/feedback/${trackId}/comments/${commentId}/replies/${replyId}/`,
        { content: newText }
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId ? updatedReply : reply
                ),
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error editing reply:", error);
    }
  };

  return (
    <div className="w-[803.4px] h-auto p-4 border rounded-lg shadow-lg">
      <h1 className="text-gray-700 text-3xl font-bold mb-4">Feedback</h1>
      <form onSubmit={handleSubmit(addComment)}>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="3"
          placeholder="Write a comment..."
          {...register("comment", { required: true })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
      <div className="mt-4 space-y-4 h-[200px] overflow-y-scroll">
        {comments.map((comment, index) => (
          <Comment
            key={index}
            comment={comment}
            trackId={trackId}
            onReply={addReply}
            onDelete={deleteComment}
            onEdit={editComment}
            onDeleteReply={deleteReply}
            onEditReply={editReply}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentCard;
