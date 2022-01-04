import { collection, onSnapshot, where } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useState } from 'react/cjs/react.development';
import { db } from '../firebase/config';

const useCollection = (col, _query, _orderBy) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const query = useRef(_query).current;
  const orderBy = useRef(_orderBy).current;

  useEffect(() => {
    const ref = collection(db, col);

    if (query) {
      ref = query(ref, where(...query));
    }
    if (orderBy) {
      ref = query(ref, orderBy(...orderBy));
    }

    const unsub = onSnapshot(
      ref,
      async (snapshot) => {
        const result = [];
        snapshot.forEach((d) => {
          result.push({ ...d.data(), id: d.id });
        });
        await setData(result);
        setError(null);
      },
      (error) => {
        setError('Could not fetch the data');
        console.log(error);
      }
    );
    console.log(data);

    return () => unsub();
  }, [col, query, orderBy]);

  return { data, error };
};

export { useCollection };
