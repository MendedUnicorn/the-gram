import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { storage } from '../../firebase/config';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import './NewPost.css';

export default function NewPost() {
  const [previewPic, setPreviewPic] = useState(null);
  const [previewPicError, setPreviewPicError] = useState(null);
  const [description, setDescription] = useState('');

  const { addDocument } = useFirestore('posts');
  const { user } = useAuthContext();

  const handleFile = (e) => {
    e.preventDefault();
    setPreviewPic(null);
    setPreviewPicError(null);
    const pic = e.target.files[0];

    if (!pic) {
      setPreviewPicError('Please select a file');
    }

    if (!pic.type.includes('image')) {
      setPreviewPicError('File needs to be an image');
      return;
    }
    if (pic.size > 2000000) {
      setPreviewPicError('File needs to be smaller than 2MB');
      return;
    }

    setPreviewPic(pic);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user.uid);
    //upload pic to storage
    const uploadPath = `posts/${user.uid}/${previewPic.name}`;
    const img = await ref(storage, uploadPath);
    const imgUpload = await uploadBytes(img, previewPic);
    const imgUrl = await getDownloadURL(img);

    const documentToAdd = {
      imgUrl,
      description,
      uid: user.uid,
      userName: user.displayName,
      likes: [],
      comments: [],
      profilePic: user.photoURL,
    };

    await addDocument(documentToAdd);
  };

  return (
    <div className='new-post'>
      <form className='new-post-form' onSubmit={handleSubmit}>
        {previewPicError && <div className='error'>{previewPicError}</div>}
        {!previewPic && <p>Please select a picture to upload</p>}
        {previewPic && (
          <img
            src={URL.createObjectURL(previewPic)}
            alt='preview'
            className='preview'
          />
        )}
        <label className='file-input'>
          <input type='file' onChange={handleFile} />
        </label>
        <label className='description'>
          <input
            type='text'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <button className='btn'>Submit</button>
        </label>
      </form>
    </div>
  );
}
