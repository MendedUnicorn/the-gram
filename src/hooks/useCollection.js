import {
  collection,
  onSnapshot,
  where,
  query,
  orderBy,
} from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { useState } from 'react/cjs/react.development';
import { db } from '../firebase/config';

const useCollection = (col, _q, _order) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const q = useRef(_q).current;
  const order = useRef(_order).current;

  useEffect(() => {
    let ref = collection(db, col);

    if (q) {
      ref = query(ref, where(...q));
    }
    if (order) {
      ref = query(ref, orderBy(...order));
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
