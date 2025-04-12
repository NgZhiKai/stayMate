import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { fetchHotels } from '../services/hotelApi'; // Importing deleteHotelById
import { HotelData } from '../types/Hotels'; // Import HotelManagement type

const AdminHotelPage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Fetch the list of hotels when the component mounts
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const hotelData = await fetchHotels();
        setHotels(hotelData);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching hotels:', error);
        setError('Failed to load hotels');
        setLoading(false);
      }
    };

    loadHotels();
  }, []);  

  // Handle delete hotel
  const deleteHotel = async (id: number) => {
    try {
      await deleteHotel(id); // Call API to delete hotel
      setHotels(hotels.filter((hotel) => hotel.id !== id)); // Remove the deleted hotel from state
    } catch (error: any) {
      console.error('Error deleting hotel:', error);
      setError('Failed to delete hotel');
    }
  };

  // Handle edit hotel (This could open a modal or navigate to an edit page)
  const editHotel = (id: number) => {
    // Redirect to an edit page or open a modal for editing hotel details
    console.log(`Editing hotel with id: ${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin - Manage Hotels</h1>
      
      <Link to="/admin/hotels/create" className="bg-green-500 text-white p-2 rounded mt-4 inline-block">
        Create New Hotel
      </Link>

      <div className="mt-6">
        {loading ? (
          <p>Loading hotels...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : hotels.length === 0 ? (
          <p>No hotels available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="border p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{hotel.name}</h2>
                <p>{hotel.address}</p>
                <p className="text-gray-500">Rating: {hotel.averageRating || 'N/A'}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-blue-500 text-white py-1 px-4 rounded"
                    onClick={() => editHotel(hotel.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-4 rounded"
                    onClick={() => deleteHotel(hotel.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHotelPage;
