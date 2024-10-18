'use client';

import { useSelector, useDispatch } from 'react-redux';
import { setUser, logoutUser } from './redux/userSlice'; // Redux actions
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import UserDetailsCard from './components/UserCardDetails'; // Import the user details card

const HomePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // Get the user data from Redux store

  // Handle submitting the updated user details
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token');
    fetch('/api/auth/update', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        alert('User details updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating user details:', error);
      });
  };

  // Handle deleting the user account
  const handleDelete = () => {
    const token = Cookies.get('token');
    if (token) {
      fetch('/api/auth/Delete', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Remove the token cookie
            Cookies.remove('token');
            // Dispatch the logout action to clear Redux state
            dispatch(logoutUser());
            // Redirect to login or home page after account deletion
            router.push('/login');
          } else {
            alert('Error deleting user account');
          }
        })
        .catch((error) => {
          console.error('Error deleting user account:', error);
        });
    }
  };

  // Handle logging out the user
  const handleLogout = () => {
    Cookies.remove('token');
    dispatch(logoutUser()); // Dispatch logout action to clear Redux state
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {user.isAuthenticated ? (
        <>
          {/* Render UserDetailsCard */}
          <UserDetailsCard />

          {/* Edit User Form */}
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => dispatch(setUser({ ...user, name: e.target.value }))}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => dispatch(setUser({ ...user, email: e.target.value }))}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md"
              >
                Save Changes
              </button>
            </form>
            <button
              onClick={handleLogout}
              className="mt-4 w-full px-4 py-2 text-white bg-gray-500 rounded-md"
            >
              Logout
            </button>
            {/* Delete User Button */}
            <button
              onClick={handleDelete}
              className="mt-4 w-full px-4 py-2 text-white bg-red-500 rounded-md"
            >
              Delete Account
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Our App</h2>
          <p className="mb-6">Please login or signup to continue.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Signup
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
