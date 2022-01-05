import { signOut } from 'firebase/auth';
import { updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { useFirestore } from './useFirestore';

const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();

  const { updateDocument } = useFirestore('users');

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      await updateDocument(user.uid, { online: false });
      const userCredential = await signOut(auth);

      dispatch({ type: 'LOGOUT' });

      if (!isCancelled) {
        setError(null);
        setIsPending(false);
      }
    } catch (error) {
      setError(error.message);
      setIsPending(false);
    }
  };
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { logout, isPending, error };
};

export { useLogout };
