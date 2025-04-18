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
  
      setIsModalOpen(true);
  
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Failed to save hotel:', error);
      setModalMessage('Failed to save hotel data.');
      setModalType('error');
      setIsModalOpen(true);
    }
  };  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg">
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
