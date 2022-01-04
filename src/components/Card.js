import './Card.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuthContext } from '../hooks/useAuthContext';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Post({ data, error }) {
  const [newComment, setNewComment] = useState('');
  const { updateDocument, response } = useFirestore('posts');
  const { user } = useAuthContext();

  const handleComment = async (e) => {
    e.preventDefault();
    const commentToAdd = {
      displayName: user.displayName,
      content: newComment,
      createdAt: Timestamp.fromDate(new Date()),
      photoURL: user.photoURL,
      id: Math.floor(Math.random() * new Date()),
    };

    await updateDocument(data.id, {
      comments: [...data.comments, commentToAdd],
    });
    if (!response.error) {
      setNewComment('');
    }
  };

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
    // add like to post - uid added to post
    // add post id to user
  };

  return (
    <div className='post'>
      <div className='header'>
        <img src={data.profilePic} alt='profilepic' />
        <div className='username'>{data.userName}</div>
      </div>
      <img src={data.imgUrl} alt='image post' className='image-post' />
      <div className='buttons'>
        <span className='material-icons' onClick={handleLike}>
          {data.likes.includes(user.uid) ? 'favorite' : 'favorite_border'}
        </span>
        <span className='material-icons'>insert_comment</span>
        <span className='material-icons'>share</span>
        <span className='material-icons md-dark'>bookmark_border</span>
      </div>
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
      <label className='reply'>
        <input
          type='text'
          placeholder='Make a comment...'
          onChange={(e) => setNewComment(e.target.value)}
          value={newComment}
        />
        <button className='btn' onClick={handleComment}>
          Publish
        </button>
      </label>
    </div>
  );
}
