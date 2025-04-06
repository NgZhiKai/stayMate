import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HotelForm from '../components/Hotel/HotelForm';
import { createHotel, fetchHotelById, updateHotel } from '../services/hotelApi'; // Assuming this API function exists

const CreateUpdateHotelPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // Read 'id' from URL (optional)
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState<any>(null); // For holding fetched hotel data if updating

  useEffect(() => {
    if (id) {
      // If 'id' exists, fetch the hotel data for update
      const fetchHotelData = async () => {
        try {
          const data = await fetchHotelById(Number(id));
          setHotelData(data); // Set hotel data for pre-filling the form
        } catch (error) {
          console.error('Failed to fetch hotel data:', error);
        }
      };
      fetchHotelData();
    }
  }, [id]);

  const handleSaveHotel = async (formData: FormData) => {
    try {
      if (id) {
        // If 'id' exists, update the hotel
        await updateHotel(Number(id), formData);
      } else {
        // If 'id' doesn't exist, create a new hotel
        await createHotel(formData);
      }
      navigate('/'); // Redirect after success
    } catch (error) {
      console.error('Failed to save hotel:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">
        {id ? 'Update Hotel' : 'Create New Hotel'}
      </h1>
      <HotelForm onSave={handleSaveHotel} hotelData={hotelData} hotelId={Number(id)}/>
    </div>
  );
};

export default CreateUpdateHotelPage;
