import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCouch, faLocationDot, faMap, faPhone, faUsers, faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { districts } from '../../data/districts';

function Body() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [capacityRange, setCapacityRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/user/venues");
        const wedding_hall = response.data;
        setData(wedding_hall);
        setFilteredData(wedding_hall);
        console.log(response);

      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let results = [...data];

    if (search) {
      results = results.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedDistrict) {
      results = results.filter(v => v.district === selectedDistrict);
    }

    results = results.filter(v =>
      v.capacity >= capacityRange[0] && v.capacity <= capacityRange[1]
    );

    if (sortBy === 'price') {
      results.sort((a, b) => a.seat_price - b.seat_price);
    } else if (sortBy === 'capacity') {
      results.sort((a, b) => a.capacity - b.capacity);
    } else if (sortBy === 'district') {
      results.sort((a, b) => a.district.localeCompare(b.district));
    }

    setFilteredData(results);
  }, [search, selectedDistrict, capacityRange, sortBy, data]);

  return (
    <div className="mx-auto px-4 py-10 pt-20 bg-gradient-to-br from-pink-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-10">Explore Wedding wedding_hall</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="relative w-full sm:w-64">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search wedding_hall..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          <option value="">All Districts</option>
          {districts.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>


        <select
          className="px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price">Price (Low to High)</option>
          <option value="capacity">Capacity (Low to High)</option>
          <option value="district">District (A-Z)</option>
        </select>

        <div className="flex items-center gap-2">
          <span>Capacity:</span>
          <input
            type="number"
            className="w-20 px-2 py-1 border rounded-md"
            value={capacityRange[0]}
            onChange={(e) => setCapacityRange([+e.target.value, capacityRange[1]])}
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            className="w-20 px-2 py-1 border rounded-md"
            value={capacityRange[1]}
            onChange={(e) => setCapacityRange([capacityRange[0], +e.target.value])}
            min="0"
          />
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">Error: {error.response?.data?.message || error.message}</p>}

      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 cursor-pointer">
          {filteredData.map((venue) => (
            <div
              key={venue.id}
              onClick={() => navigate(`/vanue/${venue.id}`)}
              className="backdrop-blur-lg bg-white/70 shadow-xl rounded-2xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-pink-300"
            >
              <img
                src={`${BASE_URL}/uploads/${venue.preview_image || 'default.jpg'}`}
                alt={venue.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{venue.name}</h2>
                <p className="text-gray-700"><strong><FontAwesomeIcon icon={faLocationDot} /> Address:</strong> {venue.address}</p>
                <p className="text-gray-700"><strong><FontAwesomeIcon icon={faMap} /> District:</strong> {venue.district}</p>
                <p className="text-gray-700"><strong><FontAwesomeIcon icon={faCouch} /> Seat Price:</strong> ${venue.seat_price}</p>
                <p className="text-gray-700"><strong><FontAwesomeIcon icon={faUsers} /> Capacity:</strong> {venue.capacity} guests</p>
                <p className="text-gray-700"><strong><FontAwesomeIcon icon={faPhone} /> Phone:</strong> {venue.phone_number}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">No wedding_hall found.</p>
      )}
    </div>
  );
}

export default Body;
