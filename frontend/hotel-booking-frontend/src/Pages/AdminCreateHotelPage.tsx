import React from 'react';
import HotelForm from '../components/Hotel/HotelForm';
import { createHotel } from '../services/hotelApi'; // Assuming this API function exists
import { useNavigate } from 'react-router-dom';

const AdminCreateHotelPage: React.FC = () => {
  const navigate = useNavigate(); // Using useNavigate hook for redirection

  const handleSaveHotel = async (formData: FormData) => {
    try {
      await createHotel(formData); // Send the FormData to the API
      navigate('/admin/hotels'); // Redirect to hotel list after creation
    } catch (error) {
      console.error('Failed to save hotel:', error);
    }
  };  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Create New Hotel</h1>
      <HotelForm onSave={handleSaveHotel} />
    </div>
  );
};

export default AdminCreateHotelPage;
