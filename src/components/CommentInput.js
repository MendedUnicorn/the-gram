import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore';
import './CommentInput.css';

export default function CommentInput({ data }) {
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
  return (
    <form>
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
    </form>
  );
}
