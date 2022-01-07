import Post from '../../components/Post';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import './Home.css';

export default function Home({ children }) {
  const { user } = useAuthContext();
  const { data, error } = useCollection('posts', null, ['createdAt', 'desc']);

  return (
    <div className='home'>
      {data && data.map((d) => <Post key={d.id} data={d} error={error} />)}
      {children}
    </div>
  );
}
