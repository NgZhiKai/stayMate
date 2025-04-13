import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUser, registerUser } from '../services/userApi';
import { User, RegisterData } from '../types/User';
import UserModal from '../components/UserModal';
import { Edit, Trash, User as UserIcon, Shield as AdminIcon } from 'lucide-react';
import MessageModal from '../components/MessageModal';

type RegisterResponse = {
  message?: string;
  data: User;
};

type UpdateResponse = {
  message?: string;
  user: User;
};

const ITEMS_PER_PAGE = 6;

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        setUsers(result.users);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
        setTimeout(() => setError(''), 5000); // Hide error after 5 seconds
      }
    };
    fetchUsers();
  }, []);

  const totalPages = Math.ceil((users.length || 1) / ITEMS_PER_PAGE);
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
  
      setUsers((prev) => {
        const updatedUsers = prev.filter((u) => u.id !== userId);
        const newTotalPages = Math.ceil(updatedUsers.length / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        }
        return updatedUsers;
      });
  
      setMessageType('success');
      setMessageContent('User deleted successfully!');
      setMessageModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      setMessageType('error');
      setMessageContent(err.message || 'Failed to delete user');
      setMessageModalOpen(true);
    }
  };  

  const handleSubmit = async (userData: User | RegisterData) => {
    try {
      if (userData.id === 0) {
        const { id, ...newUserData } = userData;
        const response: RegisterResponse = await registerUser(newUserData as RegisterData);

        if (response?.data) {
          setUsers((prev) => [...prev, response.data]);
          setIsModalOpen(false);
          setCurrentUser(null);

          setMessageType('success');
          setMessageContent(response.message || 'User added successfully!');
          setMessageModalOpen(true);

          setTimeout(() => setMessageModalOpen(false), 3000);
        }
      } else {
        const response: UpdateResponse = await updateUser(String(userData.id), userData);

        if (response?.user) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userData.id ? response.user : u))
          );
          setIsModalOpen(false);
          setCurrentUser(null);

          setMessageType('success');
          setMessageContent('User updated successfully!');
          setMessageModalOpen(true);

          setTimeout(() => setMessageModalOpen(false), 3000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit user');
      setMessageType('error');
      setMessageContent(err.message || 'Something went wrong. Please try again.');
      setMessageModalOpen(true);
    }
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen relative">
      <h1 className="text-4xl font-semibold mb-8 text-center">Admin - Manage Users</h1>

      <button
        onClick={handleAddUser}
        className="mb-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-all transform hover:scale-110 absolute top-8 right-8"
      >
        Add User
      </button>

      {users.length === 0 ? (
        <p className="text-center text-lg">No users found.</p>
      ) : (
        <ul className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUsers.map((user) => (
            <li
              key={user.id}
              className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-md shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 text-center w-full">
                <div className="flex items-center gap-2">
                  {user.role === 'ADMIN' ? (
                    <AdminIcon size={18} className="text-blue-500" />
                  ) : (
                    <UserIcon size={18} className="text-green-500" />
                  )}
                </div>
                <p className="font-semibold text-lg text-white flex-shrink-0">
                  {user.firstName} {user.lastName}
                </p>
                <div className="ml-auto flex gap-3">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 bg-green-600 hover:bg-green-500 rounded-md transform hover:scale-110 transition-all"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 bg-red-600 hover:bg-red-500 rounded-md transform hover:scale-110 transition-all"
                    title="Delete"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-400">Phone: {user.phoneNumber}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1 ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
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

      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        type={messageType}
        message={messageContent || error}
      />
    </div>
  );
};

export default ManageUsers;
