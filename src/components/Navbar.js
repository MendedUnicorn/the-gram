import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import './Navbar.css';

export default function Navbar() {
  const { logout, isPending, error } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <Link to='/'>
        <h1>The Gram</h1>
      </Link>
      {user && (
        <Link to={`/profile/${user.uid}`}>
          <h2>Hello, {user?.displayName}</h2>
          <img src={user?.photoURL} alt='profile pic' />
        </Link>
      )}
      <ul>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/post'>Post</NavLink>
        </li>
        <li>
          <NavLink to='/explore'>Explore</NavLink>
        </li>
        {!user && (
          <>
            <li>
              <NavLink to='/login'>Login</NavLink>
            </li>
            <li>
              <NavLink to='/signup'>Signup</NavLink>
            </li>
          </>
        )}
        {user && (
          <li>
            {!isPending && (
              <button onClick={handleLogout} className='btn'>
                Logout
              </button>
            )}
            {isPending && (
              <button disabled className='btn'>
                Logging out..
              </button>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
