import { useParams } from 'react-router-dom';
import Post from '../../components/Post';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useDocument } from '../../hooks/useDocument';
import './Profile.css';

export default function Profile() {
  const { uid } = useParams();
  const { data, error } = useCollection('posts', ['uid', '==', uid]);
  const { newDoc, error: userError } = useDocument('users', uid);
  const { user } = useAuthContext();

  return (
    newDoc && (
      <div className='profile'>
        <div className='user'>
          <img src={newDoc.photoURL} alt='' />
          <h2 className='title'> {newDoc && newDoc.displayName}'s Profile</h2>
        </div>
        {data && data.map((post) => <Post data={post} key={post.id} />)}
        {error && <div className='error'>{error}</div>}
      </div>
    )
  );
}
