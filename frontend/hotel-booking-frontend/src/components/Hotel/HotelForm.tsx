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
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [rooms, setRooms] = useState<RoomRequestDTO[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [check_in, setCheckIn] = useState<string>('');
  const [check_out, setCheckOut] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const fetchCoordinates = async (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${OPEN_CAGE_API_KEY}`;
  
    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
  
      if (data.status.code === 200 && data.results.length > 0) {
        // You can tune these criteria based on your requirement
        const validResult = data.results.find((result: any) => {
          const components = result.components;
          return (
            components.road &&
            components.city &&
            components.country &&
            result.components.country_code === 'sg' &&
            result.confidence >= 8
          );
        });
  
        if (validResult) {
          const { lat, lng } = validResult.geometry;
          setLatitude(lat);
          setLongitude(lng);
        } else {
          setLatitude(0);
          setLongitude(0);
        }
      } else {
        setErrors((prev) => ({ ...prev, coordinates: 'Unable to fetch coordinates for the given address' }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, coordinates: 'Error fetching coordinates' }));
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
      setRooms([{ roomType: '', pricePerNight: 0, maxOccupancy: 1, quantity: 0 }]);
    }
  }, [hotelId, hotelData]);

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z ]*$/;
    if (value === '' || regex.test(value)) {
      setName(value);
    }
  };

  const roomTypes = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Hotel name is required.';
    } else if (/^\d+$/.test(name.trim())) {
      newErrors.name = 'Hotel name cannot be only numbers.';
    }

    if (!address.trim()) {
      newErrors.address = 'Hotel address is required.';
    }

    if (!check_in) {
      newErrors.check_in = 'Check-in time is required.';
    }

    if (!check_out) {
      newErrors.check_out = 'Check-out time is required.';
    }

    const validRooms = rooms.filter((room) => typeof room.roomType === 'string' && room.roomType.trim() !== '');
    const roomTypeSet = new Set<string>();

    validRooms.forEach((room, index) => {
      const key = `room_${index}`;

      if (!room.roomType.trim()) {
        newErrors[`${key}_roomType`] = 'Room type is required.';
      }

      const normalized = room.roomType.trim().toUpperCase();
      if (roomTypeSet.has(normalized)) {
        newErrors[`${key}_duplicate`] = `Duplicate room type: ${room.roomType}`;
      } else {
        roomTypeSet.add(normalized);
      }

      if (room.pricePerNight < 0) {
        newErrors[`${key}_price`] = 'Price per night must be at least 0.';
      }

      if (room.maxOccupancy < 1) {
        newErrors[`${key}_occupancy`] = 'Occupancy must be at least 1.';
      }

      if (room.quantity < 0) {
        newErrors[`${key}_quantity`] = 'Quantity cannot be negative.';
      }
    });

    if (!hotelId && validRooms.every((room) => room.quantity === 0)) {
      newErrors.rooms = 'At least one room must have quantity greater than 0.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const convertTime = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
    };

    const filteredRooms = validRooms.filter((room) => room.quantity > 0);

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
    <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-5xl mx-auto space-y-10">
      <h2 className="text-4xl font-bold text-gray-800 text-center">
        {hotelId ? 'Update Hotel Details' : 'Add New Hotel'}
      </h2>
  
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-400 text-red-700 rounded-xl shadow-sm">
          <ul className="list-disc list-inside space-y-1 text-sm">
            {Object.values(errors).map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
  
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hotel Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameInput}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 ring-red-300' : 'focus:ring-blue-500'}`}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>
  
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${errors.address ? 'border-red-500 ring-red-300' : 'focus:ring-blue-500'}`}
          />
          {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
        </div>
  
        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input type="text" value={latitude} disabled className="w-full px-4 py-3 border rounded-xl bg-gray-100 text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input type="text" value={longitude} disabled className="w-full px-4 py-3 border rounded-xl bg-gray-100 text-gray-500" />
          </div>
        </div>
  
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Image</label>
          <input type="file" onChange={handleImageChange} className="w-full px-4 py-3 border rounded-xl" />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview.startsWith('data:') ? imagePreview : `data:image/jpeg;base64,${imagePreview}`}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border shadow-sm"
              />
            </div>
          )}
        </div>
  
        {/* Check-In / Check-Out Times */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Time</label>
            <input
              type="time"
              value={check_in}
              onChange={(e) => setCheckIn(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${errors.check_in ? 'border-red-500 ring-red-300' : 'focus:ring-blue-500'}`}
            />
            {errors.check_in && <p className="text-red-600 text-sm mt-1">{errors.check_in}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Time</label>
            <input
              type="time"
              value={check_out}
              onChange={(e) => setCheckOut(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${errors.check_out ? 'border-red-500 ring-red-300' : 'focus:ring-blue-500'}`}
            />
            {errors.check_out && <p className="text-red-600 text-sm mt-1">{errors.check_out}</p>}
          </div>
        </div>
  
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
  
        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
          <PhoneInput
            country={'sg'}
            inputClass="!w-full p-2 border rounded-xl bg-gray-50"
            containerClass="relative flex justify-end"
            value={contact}
            onChange={(value: string) => setContact(value)}
          />
        </div>
  
        {/* Room Fields */}
        {!hotelId && (
          <div className="space-y-7">
            <h3 className="text-lg font-semibold text-gray-800">Room Types</h3>
            {rooms.map((room, index) => {
              const key = `room_${index}`;
              return (
                <div key={index} className="grid grid-cols-6 gap-4 items-end">
                  
                  {/* Room Type */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                    <select
                      value={room.roomType}
                      onChange={(e) => {
                        const updatedRooms = [...rooms];
                        updatedRooms[index].roomType = e.target.value;
                        setRooms(updatedRooms);
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none ${errors[`${key}_roomType`] || errors[`${key}_duplicate`] ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {(errors[`${key}_roomType`] || errors[`${key}_duplicate`]) && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors[`${key}_roomType`] || errors[`${key}_duplicate`]}
                      </p>
                    )}
                  </div>

                  {/* Price Per Night */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price/Night</label>
                    <input
                      type="text"
                      value={room.pricePerNight || ''}
                      onChange={(e) => {
                        const updatedRooms = [...rooms];
                        updatedRooms[index].pricePerNight = Number(e.target.value);
                        setRooms(updatedRooms);
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none ${errors[`${key}_price`] ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                    />
                    {errors[`${key}_price`] && <p className="text-red-600 text-sm mt-1">{errors[`${key}_price`]}</p>}
                  </div>

                  {/* Max Occupancy */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Occupancy</label>
                    <input
                      type="text"
                      value={room.maxOccupancy || ''}
                      onChange={(e) => {
                        const updatedRooms = [...rooms];
                        updatedRooms[index].maxOccupancy = Number(e.target.value);
                        setRooms(updatedRooms);
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none ${errors[`${key}_occupancy`] ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                    />
                    {errors[`${key}_occupancy`] && <p className="text-red-600 text-sm mt-1">{errors[`${key}_occupancy`]}</p>}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="text"
                      value={room.quantity || ''}
                      onChange={(e) => {
                        const updatedRooms = [...rooms];
                        updatedRooms[index].quantity = Number(e.target.value);
                        setRooms(updatedRooms);
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none ${errors[`${key}_quantity`] ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                    />
                    {errors[`${key}_quantity`] && <p className="text-red-600 text-sm mt-1">{errors[`${key}_quantity`]}</p>}
                  </div>

                  {/* Remove Button */}
                  <div className="flex col-span-1 justify-center items-end">
                    <button
                      type="button"
                      disabled={rooms.length === 1}
                      onClick={() => {
                        if (rooms.length > 1) {
                          const updated = rooms.filter((_, i) => i !== index);
                          setRooms(updated);
                        }
                      }}
                      className="mt-auto bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 disabled:opacity-50 text-sm hover:scale-105 transition-all"
                      >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {errors.rooms && <p className="text-red-600 text-sm">{errors.rooms}</p>}

            <button
              type="button"
              onClick={() => setRooms([...rooms, { roomType: '', pricePerNight: 0, maxOccupancy: 1, quantity: 0 }])}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:scale-105 transition-all"
              >
              Add Room Type
            </button>
          </div>
        )}
  
        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all shadow-md hover:scale-105"
            >
            {hotelId ? 'Update Hotel' : 'Save Hotel'}
          </button>
        </div>
      </form>
    </div>
  );
  
  
};

export default HotelForm;
