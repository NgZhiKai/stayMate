import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser } from '../services/userApi';
import { User } from '../types/User';
import UserModal from '../components/UserModal';
import { Edit, Trash, User as UserIcon, Shield as AdminIcon } from 'lucide-react';

const ITEMS_PER_PAGE = 3;

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        console.log('Fetched users:', result.users); // Log the fetched users
        setUsers(result.users);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  const totalPages = Math.ceil((users.length || 1) / ITEMS_PER_PAGE); // Ensure totalPages always has a value
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(String(userId));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleSubmit = async (user: User) => {
    try {
      const response = await updateUser(String(user.id), user);
      if (response?.user) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? response.user : u))
        );
        setIsModalOpen(false);
        setCurrentUser(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-full relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin - Manage Users</h1>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded-md text-center mb-4">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <ul className="space-y-4 max-w-4xl mx-auto">
          {currentUsers.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-3 p-3 bg-gray-800 rounded-md shadow-sm hover:shadow-md transition-all duration-300 text-sm"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  {user.role === 'ADMIN' ? (
                    <AdminIcon size={18} className="text-blue-500" />
                  ) : (
                    <UserIcon size={18} className="text-green-500" />
                  )}
                </div>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-400">Phone: {user.phoneNumber}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(user)}
                  className="p-1.5 bg-green-600 hover:bg-green-500 rounded transition-all"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-1.5 bg-red-600 hover:bg-red-500 rounded transition-all"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentUser(null);
        }}
        onSubmit={handleSubmit}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ManageUsers;
