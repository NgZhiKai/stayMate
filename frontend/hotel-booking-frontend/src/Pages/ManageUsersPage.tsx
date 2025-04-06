import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../services/userApi';
import { User } from '../types/User';
import UserModal from '../components/UserModal';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        setUsers(result.users);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(String(userId));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleSubmit = async (user: User) => {
    try {
      const response = await updateUser(String(user.id), user);
      if (response && response.user) {
        setUsers((prevUsers) =>
          prevUsers.map((userItem) => (userItem.id === user.id ? response.user : userItem))
        );
        setIsModalOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center">Admin - Manage Users</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}

      {users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <div className="flex justify-center mt-8">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Account Type</th>
                <th className="py-2 px-4 text-left">Phone Number</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2 px-4">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role === 'CUSTOMER' ? 'USER' : user.role}</td>
                  <td className="py-2 px-4">{user.phoneNumber}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleEdit(user)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
        >
          Prev
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * usersPerPage >= users.length}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 ml-2"
        >
          Next
        </button>
      </div>

      {/* Use the UserModal for editing */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ManageUsers;
