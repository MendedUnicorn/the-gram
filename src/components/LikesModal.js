import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Children } from 'react/cjs/react.development';
import { db } from '../firebase/config';
import { useDocument } from '../hooks/useDocument';
import './LikesModal.css';

export default function LikesModal({ likes, setShowLikesModal }) {
  const [likesUser, setLikesUser] = useState([]);
  //   const test = useDocument('users', 'k9okKx1cGnUZ9g4hu4G1TvxwOjc2').newDoc
  //     .displayName;
  //   console.log('tes', test);

  useEffect(() => {
    let users = [];
    likes.forEach((like) => {
      getDoc(doc(db, 'users', like)).then((d) => {
        if (d.exists()) {
          console.log(d.id);
          setLikesUser((prev) => [...prev, { ...d.data(), uid: d.id }]);
        }
      });
    });

    // likes.forEach(async (user) => {
    //   let userd = await getDoc(doc(db, 'users', user));
    //   if (userd.exists()) {
    //     users.push(userd.data());
    //   }
    // });
    // setLikesUser(users);
  }, []);

  console.log('likesusers', likesUser);

  return (
    likesUser && (
      <div
        className='likes-modal-background'
        onClick={(e) => setShowLikesModal((prev) => !prev)}
      >
        <div className='likes-modal'>
          <h2>Likes</h2>
          {likesUser &&
            likesUser.map((user) => (
              <Link to={`/profile/${user.uid}`} key={user.uid}>
                <div className='user'>
                  <img src={user.photoURL} alt='' />
                  <p>{user.displayName}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    )
  );
}
