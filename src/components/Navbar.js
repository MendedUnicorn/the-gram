import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import './Navbar.css';

export default function Navbar() {
  const { logout, isPending, error } = useLogout();
  const { user } = useAuthContext();
  console.log(user);
  return (
    <nav className='navbar'>
      <h1>The Gram</h1>
      {user && <h2>Hello, {user?.displayName}</h2>}
      {user && <img src={user?.photoURL} alt='profile pic' />}
      <ul>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/post'>Post</NavLink>
        </li>
        <li>
          <NavLink to='/'>Explore</NavLink>
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
              <button onClick={logout} className='btn'>
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
