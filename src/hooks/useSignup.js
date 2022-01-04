import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { auth, db, storage } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (
    displayName,
    profilePic,
    email,
    password,
    confirmPassword
  ) => {
    setIsPending(true);
    setError(null);

    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords are not matching');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('create user:', userCredential.user);
      if (!userCredential) {
        throw new Error('Could not complete signup');
      }

      //upload profile pic to storage
      const uploadPath = `thumbnails/${userCredential.user.uid}/${profilePic.name}`;
      const img = await ref(storage, uploadPath);
      const imgUpload = await uploadBytes(img, profilePic);
      const imgUrl = await getDownloadURL(img);
      console.log('img', img);
      console.log('imgUrl', imgUrl);

      //update profile with displayname and profilepic
      updateProfile(auth.currentUser, {
        displayName,
        photoURL: imgUrl,
      });

      // create user document
      const userDetails = {
        online: true,
        displayName,
        photoURL: imgUrl,
        friends: [],
      };
      const docRef = doc(db, 'users', userCredential.user.uid);
      const newUser = await setDoc(docRef, userDetails);

      //dispatch login actio with payload
      dispatch({ type: 'LOGIN', payload: userCredential.user });

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

  return { signup, isPending, error };
};

export { useSignup };
