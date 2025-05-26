import { useEffect, useState } from 'react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../utils/firebase.js';
import Loading from './Loading.jsx';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    }); 

    return () => unsubscribe();
  }, []);

  if (loading) return <Loading />;

  return user ? React.cloneElement(children, { user }) : <Navigate to="/login" />;
};

export default ProtectedRoute;
