import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import { BrowserRouter } from 'react-router-dom';
import NewPost from './pages/new-post/NewPost';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { user } = useAuthContext();

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path='/'
            element={user ? <Home /> : <Navigate to='/login' />}
          />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/post' element={<NewPost />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
