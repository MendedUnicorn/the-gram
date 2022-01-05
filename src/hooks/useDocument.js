import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';

export const useDocument = (col, id) => {
  const [newDoc, setNewDoc] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const docRef = doc(db, col, id);

    const unsub = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.data()) {
          // console.log('found data', snapshot.data());
          const retrievedData = snapshot.data();
          setNewDoc({ ...retrievedData, id: snapshot.id });
          setError(null);
          // console.log('the data', document);
        } else {
          setError('No such document');
        }
      },
      (error) => {
        console.log(error.message);
        setError('Error retrieving document');
      }
    );
    console.log('mewdata', newDoc);
    return () => unsub();
  }, [col, id]);

  return { newDoc, error };
};
