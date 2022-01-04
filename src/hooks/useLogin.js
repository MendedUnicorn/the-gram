import { signInWithEmailAndPassword } from 'firebase/auth';

import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { useFirestore } from './useFirestore';

const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();
  const { updateDocument } = useFirestore('users');

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential) {
        throw new Error('Login failed');
      }

      await updateDocument(userCredential.user.uid, { online: true });

      dispatch({ type: 'LOGIN', payload: userCredential.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      setError(error.message);
      setIsPending(false);
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, isPending, error };
};

export { useLogin };
