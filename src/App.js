import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import { BrowserRouter } from 'react-router-dom';
import NewPost from './pages/new-post/NewPost';
import { useAuthContext } from './hooks/useAuthContext';
import Explore from './pages/explore/Explore';
import PostModal from './components/PostModal';

function App() {
  const { user, authIsReady } = useAuthContext();
  let location = useLocation();
  console.log('loc', location?.state?.fromHome);
  return (
    <div className='App'>
      {authIsReady && (
        <>
          <Navbar />
          <Routes>
            <Route
              path='/'
              element={user ? <Home /> : <Navigate to='/login' />}
            />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/post'
              element={user ? <NewPost /> : <Navigate to='/login' />}
            />
            <Route
              path='/explore'
              element={user ? <Explore /> : <Navigate to='/login' />}
            />

            <Route
              path='/p/:id'
              element={
                location.state?.fromHome === true ? (
                  <Home>
                    <PostModal />
                  </Home>
                ) : (
                  <Explore>
                    <PostModal />
                  </Explore>
                )
              }
            />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
