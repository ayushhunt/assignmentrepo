// components/UserDetailsCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'; // Redux actions
import Cookies from 'js-cookie';

const UserDetailsCard = () => {
  const dispatch = useDispatch();
  const [user, setUserState] = useState(null); // Local state for user details
  const [loading, setLoading] = useState(true); // Local state for loading

  // Function to handle fetching user details
  const fetchUserDetails = () => {
    const token = Cookies.get('token');
    if (token) {
      fetch('/api/auth/GetUser', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUserState(data); // Set local state for the component
          dispatch(setUser(data)); // Dispatch to Redux store
          setLoading(false); // Set loading to false
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
          setLoading(false); // Set loading to false even if there's an error
        });
    } else {
      setLoading(false); // No token found, set loading to false
    }
  };

  // Fetch user details on mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>No user data found</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <p className="text-lg font-semibold mb-2">Name: {user.name}</p>
      <p className="text-lg font-semibold mb-2">Email: {user.email}</p>
      <p className="text-lg font-semibold mb-2">
        Status: {user.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </p>
    </div>
  );
};

export default UserDetailsCard;
