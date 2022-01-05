import './Card.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuthContext } from '../hooks/useAuthContext';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import CommentInput from './CommentInput';
import Buttons from './Buttons';
import { Link } from 'react-router-dom';

export default function Post({ data, error }) {
  const { updateDocument, response } = useFirestore('posts');
  const { user } = useAuthContext();

  const handleLike = async (e) => {
    e.preventDefault();

    //if user already likes post - remove like
    if (data.likes.includes(user.uid)) {
      console.log('already liked');
      await updateDocument(data.id, {
        likes: data.likes.filter((id) => id !== user.uid),
      });
    } else {
      console.log('new like', user.uid);
      await updateDocument(data.id, {
        likes: [...data.likes, user.uid],
      });
    }
  };

  return (
    <div className='post'>
      <div className='header'>
        <img src={data.profilePic} alt='profilepic' />

        <div className='username'>{data.userName}</div>
      </div>
      <Link to={`/p/${data.id}`} state={{ fromHome: true }}>
        <img src={data.imgUrl} alt='image post' className='image-post' />{' '}
      </Link>
      <Buttons data={data} />
      <div className='likes'>
        <p>{data.likes.length} likes</p>
      </div>
      <p className='description'>{data.description}</p>
      <div className='comments'>
        {data.comments.map((comment) => (
          <p key={comment.id}>
            {comment.displayName}: {comment.content}
          </p>
        ))}
      </div>
      <p className='post-time'>
        {formatDistanceToNow(data.createdAt.toDate(), {
          includeSeconds: true,
          addSuffix: true,
        })}
      </p>
      <CommentInput data={data} />
    </div>
  );
}
