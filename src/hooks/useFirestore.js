import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useReducer, useState } from 'react';
import { db } from '../firebase/config';

const initialState = {
  isPending: false,
  document: null,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, error: null, success: null };

    case 'ADDED_DOCUMENT':
      return {
        document: action.payload,
        isPending: false,
        error: false,
        success: true,
      };
    case 'UPDATED_DOCUMENT':
      return {
        document: action.payload,
        isPending: false,
        error: false,
        success: true,
      };
    case 'DELETED_DOCUMENT':
      return { document: null, isPending: false, error: false, success: true };

    case 'ERROR':
      return {
        document: null,
        isPending: false,
        error: action.payload,
        success: false,
      };
    default:
      return state;
  }
};

const useFirestore = (col) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  //collection reference
  const collectionRef = collection(db, col);

  //only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const createdAt = Timestamp.fromDate(new Date());
      const addedDocument = await addDoc(collectionRef, {
        ...doc,
        createdAt,
      });
      dispatchIfNotCancelled({
        type: 'ADDED_DOCUMENT',
        payload: addedDocument,
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: error.message });
    }
  };

  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const docRef = doc(db, col, id);
      const updatedDocument = await updateDoc(docRef, updates);
      dispatchIfNotCancelled({
        type: 'UPDATED_DOCUMENT',
        payload: updatedDocument,
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: error.message });
    }
  };

  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const docRef = doc(db, col, id);
      const deletedDocument = await deleteDoc(docRef);
    } catch (error) {
      console.log(error.message);
      dispatch({ type: 'ERROR', payload: error.message });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, updateDocument, deleteDocument, response };
};

export { useFirestore };
