import './Post.css';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useAuthContext } from '../hooks/useAuthContext';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import CommentInput from './CommentInput';
import Buttons from './Buttons';
import { Link } from 'react-router-dom';
import LikesModal from './LikesModal';

export default function Post({ data, error }) {
  const { updateDocument, response } = useFirestore('posts');
  const { user } = useAuthContext();
  const [showLikesModal, setShowLikesModal] = useState(false);

  const handleDeleteComment = (e) => {
    e.preventDefault(e);
    //console.log('comment.id', comment.id);
    updateDocument(data.id, {
      comments: data.comments.filter(
        (comment) =>
          comment.id.toString() !== e.target.attributes.commentid.value
      ),
    });
  };

  const handleShowLikes = (e) => {
    e.preventDefault();
    setShowLikesModal((prev) => setShowLikesModal(!prev));
  };

  return (
    data && (
      <div className='post'>
        {showLikesModal && (
          <LikesModal
            likes={data.likes}
            setShowLikesModal={setShowLikesModal}
          />
        )}
        <Link to={`/profile/${data.uid}`} className='header'>
          <img src={data.profilePic} alt='profilepic' />

          <div className='username'>{data.userName}</div>
        </Link>
        <Link to={`/p/${data.id}`} state={{ fromHome: true }}>
          <img src={data.imgUrl} alt='from post' className='image-post' />
        </Link>
        <Buttons data={data} />
        <div className='likes'>
          <p onClick={handleShowLikes}>{data.likes?.length} likes</p>
        </div>
        <p className='description'>{data.description}</p>
        <div className='comments'>
          {data?.comments?.map((comment) => (
            <p key={comment.id} className='comment'>
              {comment.displayName}: {comment.content}
              {user.displayName === comment.displayName && (
                <span
                  onClick={handleDeleteComment}
                  className='material-icons delete'
                  commentid={comment.id}
                >
                  delete_outline
                </span>
              )}
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
    )
  );
}
