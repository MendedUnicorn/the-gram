import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../../hooks/useSignup';
import './Signup.css';

export default function Signup() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, error, isPending } = useSignup();
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicError, setProfilePicError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(displayName, profilePic, email, password, confirmPassword);
    console.log(displayName, profilePic, email, password, confirmPassword);

    navigate('/');
  };

  const handleFile = (e) => {
    setProfilePicError(null);
    e.preventDefault();
    const pic = e.target.files[0];
    console.log(pic);

    if (!pic) {
      setProfilePicError('Please select a file');
    }

    if (!pic.type.includes('image')) {
      setProfilePicError('File needs to be an image');
      return;
    }
    if (pic.size > 2000000) {
      setProfilePicError('File needs to be smaller than 2MB');
      return;
    }

    setProfilePic(pic);
  };

  return (
    <form onSubmit={handleSubmit} className='auth-form'>
      <h2>Signup</h2>
      <label>
        <span>Username:</span>
        <input
          required
          type='text'
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      <label>
        <input required type='file' onChange={handleFile} />
      </label>

      <label>
        <span>Email:</span>
        <input
          required
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>Password:</span>
        <input
          required
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span>Confirm password:</span>
        <input
          required
          type='password'
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
      </label>
      {!isPending && <button className='btn'>Signup</button>}
      {isPending && (
        <button className='btn' disabled>
          Loading...
        </button>
      )}

      {error && <p>{error}</p>}
      {profilePicError && <p>{profilePicError}</p>}
    </form>
  );
}
