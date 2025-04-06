import React, { useEffect, useState } from 'react';
import { RoomRequestDTO } from '../../types/Room';

interface HotelFormProps {
  onSave: (formData: FormData) => Promise<void>;
}

const HotelForm: React.FC<HotelFormProps> = ({ onSave }) => {
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [rooms, setRooms] = useState<RoomRequestDTO[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [check_in, setCheckIn] = useState<string>(''); // New state for check-in time
  const [check_out, setCheckOut] = useState<string>(''); // New state for check-out time
  const [description, setDescription] = useState<string>(''); // New state for description
  const [contact, setContact] = useState<string>(''); // New state for contact info

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validation check
    if (!name || !address || rooms.length === 0 || !check_in || !check_out) {
      setError('Please fill in all required fields and add at least one room');
      return;
    }
  
    // Convert time to required format
    const convertTime = (time: string) => {
      // Split the time into hours, minutes, and seconds
      const [hour, minute] = time.split(':').map(Number);
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    };

    const filteredRooms = rooms.filter((room) => room.quantity > 0);

    const formData = new FormData();
    // Instead of appending as Blob, append directly as JSON
    formData.append('hotelDetails', JSON.stringify({
      name,
      address,
      latitude,
      longitude,
      rooms: filteredRooms,
      description,
      contact,
      checkIn: convertTime(check_in),
      checkOut: convertTime(check_out),
    }));
  
    if (image) {
      formData.append('image', image); // Append the image file
    }
    
    await onSave(formData);
  };    

  const roomTypes = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'];

  useEffect(() => {
    setRooms(
      roomTypes.map((roomType) => ({
        roomType,
        pricePerNight: 0,
        maxOccupancy: 1,
        quantity: 0,
      }))
    );
  }, []);

  const handleRoomChange = (index: number, field: string, value: any) => {
    const updatedRooms = [...rooms]; // Create a copy of the current rooms array
    updatedRooms[index] = {
      ...updatedRooms[index], // Retain other room properties
      [field]: value, // Update the field (e.g., 'pricePerNight', 'maxOccupancy', etc.)
    };
    setRooms(updatedRooms); // Update the state with the modified rooms array
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Add New Hotel
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Hotel Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Hotel Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Hotel Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Latitude */}
        <div className="mb-4">
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Longitude */}
        <div className="mb-4">
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Hotel Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <img src={imagePreview} alt="Image Preview" className="w-32 h-32 object-cover" />
          </div>
        )}

        {/* Check-In Time */}
        <div className="mb-4">
          <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
            Check-In Time
          </label>
          <input
            type="time"
            id="checkIn"
            value={check_in}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Check-Out Time */}
        <div className="mb-4">
          <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
            Check-Out Time
          </label>
          <input
            type="time"
            id="checkOut"
            value={check_out}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Hotel Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
            Contact Info
          </label>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        {/* Rooms */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Rooms</h3>
          {rooms.map((room, index) => (
            <div key={index} className="flex gap-4 mb-4">
              {/* Room Type */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Room Type</label>
                <input
                  type="text"
                  value={room.roomType}
                  disabled
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>

              {/* Price Per Night */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Price per Night</label>
                <input
                  type="number"
                  value={room.pricePerNight}
                  onChange={(e) => handleRoomChange(index, 'pricePerNight', Number(e.target.value))}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>

              {/* Max Occupancy */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Max Occupancy</label>
                <input
                  type="number"
                  value={room.maxOccupancy}
                  onChange={(e) => handleRoomChange(index, 'maxOccupancy', Number(e.target.value))}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>

              {/* Quantity */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={room.quantity}
                  onChange={(e) => handleRoomChange(index, 'quantity', Number(e.target.value))}
                  className="mt-1 p-2 border rounded-md w-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Save Hotel
        </button>
      </form>
    </div>
  );
};

export default HotelForm;
