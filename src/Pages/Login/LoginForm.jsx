import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import './LoginForm.css';
import bg1 from '../../assets/background/mb1.jpg';
import bg2 from '../../assets/background/mb2.jpg';
import bg3 from '../../assets/background/mb3.jpg';
import bg4 from '../../assets/background/mb4.jpg';
import bg5 from '../../assets/background/of1.jpg';
import logo from '../../assets/background/logo1.jpg';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [bg1, bg2, bg3, bg4, bg5];
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorCode = error.code;
      const errorMessage = getErrorMessage(errorCode);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Email tidak valid.';
      case 'auth/user-disabled':
        return 'Akun ini telah dinonaktifkan.';
      case 'auth/user-not-found':
        return 'Email tidak ditemukan.';
      case 'auth/wrong-password':
        return 'Password salah.';
      default:
        return 'Terjadi kesalahan saat login. Silakan coba lagi.';
    }
  };

  useEffect(() => {
    const timeout = 300000; // 5 minutes in milliseconds
    let timer = setTimeout(() => {
      auth.signOut();
      navigate('/login');
    }, timeout);

    const resetTimeout = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        auth.signOut();
        navigate('/login');
      }, timeout);
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    window.addEventListener('click', resetTimeout);
    window.addEventListener('scroll', resetTimeout);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
      window.removeEventListener('click', resetTimeout);
      window.removeEventListener('scroll', resetTimeout);
    };
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    

    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" >
      <div className="absolute inset-0 z-0 slideshow" >
        <img src={slides[slideIndex]} alt="background" className="w-full h-full object-cover" style={{opacity : 0.8}}/>
      </div>
      <div className="bg-transparent p-8 rounded-lg w-96 z-10"   />
      <div className="bg-transparent p-8 rounded-lg w-9 z-10"   />

      

      <div className="bg-white p-8 rounded-lg shadow-md w-96 z-10">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-32 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Teknik Airnav Cabang Manado
          </p>
        </div>
      </div>
      <div className="bg-transparent p-8 rounded-lg w-96 z-10"   />
      <div className="bg-transparent p-8 rounded-lg w-96 z-10"   />
    </div>

  );
};

export default LoginForm;