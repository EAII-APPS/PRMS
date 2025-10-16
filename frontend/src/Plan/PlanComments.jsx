import React, { useState, useEffect } from 'react';
import axiosInstance from "../GlobalContexts/Base_url";
import { useAuth } from "../GlobalContexts/Auth-Context";
import { useTranslation } from "react-i18next";

const PlanComments = ({ doc_id }) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const authInfo = useAuth();
  const token = localStorage.getItem("access");
  
  
  useEffect(() => {
    if (!doc_id) return; // Ensure planDocument_id is defined
    axiosInstance.get(`/planApp/plancomments/?planDocument_id=${doc_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the comments!", error);
      });
  }, [token, doc_id]);
  
  const fetchComment = () => {
    if (!doc_id) return; // Ensure planDocument_id is defined
    axiosInstance.get(`/planApp/plancomments/?planDocument_id=${doc_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the comments!", error);
      });
  }
  

  const handleCommentdelete=(id)=>{
    axiosInstance.delete(`/planApp/plancomments/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
      fetchComment(); // Fetch comments after deletion
    })
    .catch(error => {
      console.error("There was an error deleting the comment!", error);
    });
  }
  const handleReplydelete=(commentId,replyid)=>{
    axiosInstance.delete(`/planApp/plancomments/${commentId}/replies/${replyid}/`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      fetchComment(); // Fetch comments after deletion
    })
    .catch(error => {
      console.error("There was an error deleting the Reply!", error);
    });
  }

  const handleComment = (e) => {
    e.preventDefault();
    const newCommentObj = {
      content: newComment,
      planDocument: doc_id
    };
    axiosInstance.post('/planApp/plancomments/', newCommentObj, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setComments([...comments, response.data]);
        setNewComment('');
      })
      .catch(error => {
        console.error("There was an error submitting the comment!", error);
      });
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    const newReply = {
      content: replyText,
      comment: commentId
    };
    axiosInstance.post(`/planApp/plancomments/${commentId}/replies/`, newReply, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const updatedComments = comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, replies: [...comment.replies, response.data] };
          }
          return comment;
        });
        setComments(updatedComments);
        setReplyingTo(null);
        setReplyText('');
      })
      .catch(error => {
        console.error("There was an error submitting the reply!", error);
      });
  };

  return (
    <div>
      <form className='w-3/4 mt-5 mx-auto shadow-sm' onSubmit={handleComment}>
        <label htmlFor="chat" className="sr-only">Your Comment</label>
        <div className="flex items-center px-3 py-2 rounded-lg ">
          <textarea
            id="chat"
            rows="1"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your message..."
          ></textarea>
          <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
            <svg className="w-5 h-5 rotate-90 rtl:-rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
      <div className='overflow-y-scroll max-h-[500px]'>
      <div className='m-0'>
        {comments.map(comment => (
          <div key={comment.id} className='mb-4'>
            <blockquote className="p-6 my-4 ml-5 w-4/5 border-s-4 border-blue-900 shadow-lg bg-blue-50">
              <span>
                <p className='font-semibold'>{comment.username}</p>
                <p className='float-end'>{comment.created_at.substring(0, 16)}</p>
              </span>
              <p className="text-xl italic font-medium leading-relaxed text-gray-900 dark:text-white pb-0 mb-0">{comment.content}</p>
              {authInfo.user.monitoring_id || authInfo.user.is_superadmin ? (
              <p className='float-end cursor-pointer mt-0 text-red-300 mx-5' onClick={() => handleCommentdelete(comment.id)}>Delete</p>
              ): (
                <div></div>
              )}
              <p className='float-end cursor-pointer mt-0' onClick={() => handleReply(comment.id)}>Reply</p>
              {replyingTo === comment.id && (
                <form className='mt-2' onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                  <textarea
                    rows="1"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your reply..."
                  ></textarea>
                  <button type="submit" className="mt-2 inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">Submit Reply</button>
                </form>
              )}
            </blockquote>
            {comment.replies && comment.replies.map((reply, index) => (
              <blockquote key={index} className="ml-12 p-6 my-2 w-3/5 border-s-4 border-orange-900 bg-orange-50">
                <span>
                  <p className='font-semibold'>{reply.username}</p>
                  <p className='float-end'>{reply.created_at.substring(0, 16)}</p>
                </span>
                <p className="text-md italic font-medium leading-relaxed text-gray-900 dark:text-white pb-0 mb-0">{reply.content}</p>
                {authInfo.user.monitoring_id ? (
              <p className='float-end cursor-pointer mt-0 text-red-300 mx-5' onClick={() => handleCommentdelete(comment.id)}>Delete</p>
              ): (
                <div></div>
              )}              
              </blockquote>
            ))}
          </div>
        ))}
      </div>
      </div>

    </div>
  );
};

export default PlanComments;
