import { collectionGroup } from 'firebase/firestore';
import { useCollection } from '../../hooks/useCollection';
import Masonry from 'react-masonry-css';
import './Explore.css';
import PostModal from '../../components/PostModal';
import { useState } from 'react';
import { differenceInSecondsWithOptions } from 'date-fns/fp';
import { Link, useParams } from 'react-router-dom';

export default function Explore({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [postToShow, setPostToShow] = useState('');

  const handlePostClick = () => {};

  const { data, error } = useCollection('posts', null, ['createdAt', 'desc']);

  return (
    <div className='explore'>
      {data?.map((post) => {
        return (
          <div key={Date.now() * Math.random()}>
            <Link
              key={data.id}
              to={`/p/${post.id}`}
              state={{ fromHome: false }}
            >
              <div key={data.id} className='pic'>
                <img src={post.imgUrl} alt={post.description} />
              </div>
            </Link>
          </div>
        );
      })}

      {children}
    </div>
  );
}
