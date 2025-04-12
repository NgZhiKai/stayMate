import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HotelForm from '../components/Hotel/HotelForm';
import { createHotel, fetchHotelById, updateHotel } from '../services/hotelApi';
import MessageModal from '../components/MessageModal'; // Make sure the path is correct

const CreateUpdateHotelPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success'); // Default to success

  useEffect(() => {
    if (id) {
      const fetchHotelData = async () => {
        try {
          const data = await fetchHotelById(Number(id));
          setHotelData(data);
        } catch (error) {
          console.error('Failed to fetch hotel data:', error);
          setModalMessage('Failed to fetch hotel data.');
          setModalType('error');
          setIsModalOpen(true);
        }
      };
      fetchHotelData();
    }
  }, [id]);

  const handleSaveHotel = async (formData: FormData) => {
    try {
      if (id) {
        await updateHotel(Number(id), formData);
        setModalMessage('Hotel updated successfully!');
        setModalType('success');
      } else {
        await createHotel(formData);
        setModalMessage('Hotel created successfully!');
        setModalType('success');
      }
      console.log('Setting modal to open');
      setIsModalOpen(true);
      navigate('/');
    } catch (error) {
      console.error('Failed to save hotel:', error);
      setModalMessage('Failed to save hotel data.');
      setModalType('error');
      setIsModalOpen(true);  // Make sure this gets called
    }
  };  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          {id ? 'Update Hotel' : 'Create New Hotel'}
        </h1>
        <HotelForm onSave={handleSaveHotel} hotelData={hotelData} hotelId={Number(id)} />
      </div>
      <MessageModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        message={modalMessage} 
        type={modalType} 
      />
    </div>
  );
};

export default CreateUpdateHotelPage;
