import Post from '../../components/Card';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import './Home.css';

export default function Home() {
  const { user } = useAuthContext();
  const { data, error } = useCollection('posts');
  console.log('data for ', data);
  return (
    <div>
      {user && <h1>Welcome, {user.displayName}</h1>}
      {data && data.map((d) => <Post key={d.id} data={d} error={error} />)}
    </div>
  );
}
