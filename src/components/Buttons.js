import { useAuthContext } from '../hooks/useAuthContext';
import { useFirestore } from '../hooks/useFirestore';

export default function Buttons({ data }) {
  const { updateDocument, response } = useFirestore('posts');
  const { user } = useAuthContext();
  const handleLike = async (e) => {
    e.preventDefault();

    //if user already likes post - remove like
    if (data.likes.includes(user.uid)) {
      await updateDocument(data.id, {
        likes: data.likes.filter((id) => id !== user.uid),
      });
    } else {
      await updateDocument(data.id, {
        likes: [...data.likes, user.uid],
      });
    }
  };

  return (
    data && (
      <div className='buttons'>
        <span className='material-icons' onClick={handleLike}>
          {data.likes.includes(user.uid) ? 'favorite' : 'favorite_border'}
        </span>
        <span className='material-icons'>insert_comment</span>
        <span className='material-icons'>share</span>
        <span className='material-icons md-dark'>bookmark_border</span>
      </div>
    )
  );
}
