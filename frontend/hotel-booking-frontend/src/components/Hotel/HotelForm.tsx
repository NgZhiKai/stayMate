import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { OPEN_CAGE_API_KEY } from '../../constants/constants';
import { RoomRequestDTO } from '../../types/Room';

interface HotelFormProps {
  onSave: (formData: FormData) => Promise<void>;
  hotelId?: number;
  hotelData?: any;
}

const HotelForm: React.FC<HotelFormProps> = ({ onSave, hotelId, hotelData }) => {
  const [id, setId] = useState<number | null>(hotelId || null);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [rooms, setRooms] = useState<RoomRequestDTO[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [check_in, setCheckIn] = useState<string>('');
  const [check_out, setCheckOut] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contact, setContact] = useState<string>('');

  const fetchCoordinates = async (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${OPEN_CAGE_API_KEY}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      if (data.status.code === 200 && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setLatitude(lat);
        setLongitude(lng);
      } else {
        setError('Unable to fetch coordinates for the given address');
      }
    } catch (error) {
      setError('Error fetching coordinates');
    }
  };

  useEffect(() => {
    if (address) {
      fetchCoordinates(address);
    } else {
      setLatitude(0);
      setLongitude(0);
    }
  }, [address]);

  useEffect(() => {
    if (hotelId && hotelData) {
      setId(hotelData.id);
      setName(hotelData.name);
      setAddress(hotelData.address);
      setLatitude(hotelData.latitude);
      setLongitude(hotelData.longitude);
      setImagePreview(hotelData.image);
      setDescription(hotelData.description);
      setContact(hotelData.contact);
      setCheckIn(hotelData.checkIn);
      setCheckOut(hotelData.checkOut);
      setRooms(hotelData.rooms || []);
    } else if (!hotelId) {
      setRooms(
        roomTypes.map((roomType) => ({
          roomType,
          pricePerNight: 0,
          maxOccupancy: 1,
          quantity: 0,
        }))
      );
    }
  }, [hotelId, hotelData]);

  const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const regex = /^[a-zA-Z ]*$/; // Allow letters and spaces only
    if (regex.test(value)) {
      setName(value);
      setError(""); // Clear error if valid input
    } else {
      setError("Names can only contain letters and spaces.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || (!hotelId && rooms.every(room => room.quantity === 0)) || !check_in || !check_out) {
      setError('Please fill in all required fields and add at least one room if creating a new hotel');
      return;
    }

    if (!isNaN(Number(name))) {
      setError('Hotel name cannot be a number');
      return;
    }

    const convertTime = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    };

    const filteredRooms = rooms.filter((room) => room.quantity > 0);

    const formData = new FormData();
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
      formData.append('image', image);
    } else if (imagePreview) {
      formData.append('image', imagePreview);
    }

    await onSave(formData);
  };

  const roomTypes = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'];

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
        {hotelId ? 'Edit Hotel' : 'Add New Hotel'}
      </h2>

      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit}>
        {id !== null && (
          <input type="hidden" value={id} name="id" />
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Hotel Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onInput={(e) => handleNameInput(e)}
            className="mt-1 p-2 border rounded-md w-full"
            required
          />
        </div>

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

        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              disabled
              type="number"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(Number(e.target.value))}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              disabled
              type="number"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(Number(e.target.value))}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>
        </div>

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

        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview.startsWith('data:') ? imagePreview : `data:image/jpeg;base64,${imagePreview}`}
              alt="Image Preview"
              className="w-32 h-32 object-cover"
            />
          </div>
        )}

        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
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

          <div className="w-1/2">
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
        </div>

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
          {/* Use PhoneInput here */}
          <PhoneInput
            country={'sg'}  // Set the default country to Singapore
            inputClass="!w-full p-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            containerClass="w-full flex justify-end"  // Ensure the container takes the full width
            value={contact}
            onChange={(value: string) => setContact(value)}  // Directly set the value to state
          />
        </div>



        {!hotelId && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Rooms</h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <label className="text-sm font-medium">Room Type</label>
              <label className="text-sm font-medium">Price per Night</label>
              <label className="text-sm font-medium">Max Occupancy</label>
              <label className="text-sm font-medium">Quantity</label>

              {roomTypes.map((roomType, index) => (
                <React.Fragment key={index}>
                  <input
                    type="text"
                    value={roomType}
                    disabled
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="number"
                    min={0}
                    value={rooms[index]?.pricePerNight || 0}
                    onChange={(e) => {
                      const updatedRooms = [...rooms];
                      updatedRooms[index].pricePerNight = Number(e.target.value);
                      setRooms(updatedRooms);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="number"
                    min={1}
                    value={rooms[index]?.maxOccupancy || 1}
                    onChange={(e) => {
                      const updatedRooms = [...rooms];
                      updatedRooms[index].maxOccupancy = Number(e.target.value);
                      setRooms(updatedRooms);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                  <input
                    type="number"
                    min={0}
                    value={rooms[index]?.quantity || 0}
                    onChange={(e) => {
                      const updatedRooms = [...rooms];
                      updatedRooms[index].quantity = Number(e.target.value);
                      setRooms(updatedRooms);
                    }}
                    className="w-full p-2 border rounded-md"
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700">
            {hotelId ? 'Update Hotel' : 'Save Hotel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
