import Post from '../../components/Post';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import './Profile.css';

export default function Profile() {
  const { data, error } = useCollection('posts');
  const { user } = useAuthContext();

  return (
    data && (
      <div className='profile'>
        {data &&
          data.map((post) => {
            console.log('user', user.uid, 'postuser', post.uid);
            if (user.uid == post.uid) {
              return <Post key={post.id} data={post} />;
            }
          })}
        {error && <div className='error'>{error}</div>}
      </div>
    )
  );
}
