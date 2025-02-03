import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [hotels, setHotels] = useState([]);
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error fetching location", error);
        }
      );
    }
  }, []);

  const fetchHotels = async () => {
    const response = await axios.get('http://localhost:8080/api/hotels');
    setHotels(response.data);
  };

  const fetchRecommendations = async () => {
    if (userLat && userLon) {
      const response = await axios.get(`http://localhost:8080/api/hotels/recommendations?userLat=${userLat}&userLon=${userLon}`);
      setHotels(response.data);
    }
  };

  const sortByPriceAsc = async () => {
    const response = await axios.get('http://localhost:8080/api/hotels/sort/price-asc');
    setHotels(response.data);
  };

  const sortByPriceDesc = async () => {
    const response = await axios.get('http://localhost:8080/api/hotels/sort/price-desc');
    setHotels(response.data);
  };

  return (
    <div>
      <h1>Hotel Booking System</h1>
      <button onClick={fetchHotels}>Load Hotels</button>
      <button onClick={fetchRecommendations}>Get Recommendations</button>
      <button onClick={sortByPriceAsc}>Sort by Price (Low to High)</button>
      <button onClick={sortByPriceDesc}>Sort by Price (High to Low)</button>

      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            <h2>{hotel.name}</h2>
            <p>{hotel.address}</p>
            <p>Price: ${hotel.pricePerNight} per night</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;