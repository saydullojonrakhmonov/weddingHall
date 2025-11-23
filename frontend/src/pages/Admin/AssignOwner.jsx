import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';

const AssignOwner = () => {
  const [wedding_hall, setwedding_hall] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch wedding_hall and owners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [wedding_hallRes, ownersRes] = await Promise.all([
          axios.get('/admin/venues', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          await axios.get('/admin/owners', {
            headers: { Authorization: `Bearer ${token}` }
          })          
        ]);
        setwedding_hall(wedding_hallRes.data);
        setOwners(ownersRes.data.owners);
      } catch (err) {
        console.error(err);
        setError('Failed to load venue or owners.');
      }
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    setError('');
    setMessage('');
  
    if (!selectedVenue || !selectedOwner) {
      setError('Please select both venue and owner.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/admin/venues/${selectedVenue}/assign`, 
  { user_id: selectedOwner }, 
  { headers: { Authorization: `Bearer ${token}` } }
)
      setMessage('Owner assigned successfully.');
    } catch (err) {
      console.error(err);
      setError('Failed to assign owner.');
    }
  };
  

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">Assign Owner to Venue</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Venue:</label>
        <select
          className="w-full border rounded p-2"
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
        >
          <option value="">Choose a venue</option>
          {wedding_hall.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.address})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Owner:</label>
        <select
          className="w-full border rounded p-2"
          value={selectedOwner}
          onChange={(e) => setSelectedOwner(e.target.value)}
        >
          <option value="">Choose an owner</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>
              {o.first_name} {o.last_name} ({o.user_name})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
      >
        Assign Owner
      </button>
    </div>
  );
};

export default AssignOwner;
