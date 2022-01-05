import { getByTestId } from '@testing-library/react';
import { useState } from 'react';
import {
  useLinkClickHandler,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useRef } from 'react/cjs/react.development';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';
import Buttons from './Buttons';
import CommentInput from './CommentInput';
import './PostModal.css';

export default function PostModal() {
  const { id } = useParams();
  let { newDoc, error } = useDocument('posts', id);
  const navigate = useNavigate();
  const location = useLocation();
  const { deleteDocument } = useFirestore('posts');
  // const location = useLocation();
  // console.log(!!location?.state?.fromHome);

  if (error) {
    return <div className='error'>{error}</div>;
  }
  if (!document) {
    return <div className='loading'>Loading...</div>;
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    await deleteDocument(newDoc.id);
    if (location.state.fromHome === true) {
      navigate('/');
    } else {
      navigate('/explore');
    }
  };

  return (
    <div
      className='background'
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          console.log(location);
          if (location.state.fromHome === true) {
            navigate('/');
          } else {
            navigate('/explore');
          }
        }
      }}
    >
      <div className='modal'>
        {document.description}
        <img src={newDoc?.imgUrl} alt='' />
        <div className='sidebar'>
          <div className='user'>
            <img src={newDoc?.profilePic} className='profile-pic' alt='' />{' '}
            <p>{newDoc?.userName}</p>
            <button className='btn' onClick={handleDelete}>
              Delete Post
            </button>
          </div>
          <div className='description'>{newDoc?.description}</div>
          <div className='comments'>
            {newDoc?.comments.map((comment) => (
              <p className='comment'>
                {comment.displayName}: {comment.content}{' '}
              </p>
            ))}
          </div>
          <Buttons data={newDoc} />
          <CommentInput data={newDoc} />
        </div>
      </div>
    </div>
  );
}
