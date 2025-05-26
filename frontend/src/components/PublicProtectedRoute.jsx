import { useEffect, useState } from 'react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../utils/firebase.js';
import Loading from './Loading.jsx';
import { ApiHandler } from '../utils/ApiHandler.js';

const PublicProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      try {
        const response = await ApiHandler("users/verify-user", "POST", {});
        if (response.statusCode === 200) {
          console.log("User verified:", response.data);
          setUser(response.data); // your verified user data
        } else {
          setUser(null); // verification failed
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setUser(null);
      }
    } else {
      setUser(null); // no logged-in user
    }
    setLoading(false); // loading done after verification
  });

  return () => unsubscribe();
}, []);


  if (loading) return <Loading />;

  return user ? React.cloneElement(children, { user }) : children;
};

export default PublicProtectedRoute;
