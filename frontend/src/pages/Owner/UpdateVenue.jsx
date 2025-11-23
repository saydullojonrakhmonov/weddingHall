import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { districts } from '../../data/districts';

const UpdateVenue = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        seat_price: '',
        phone_number: '',
        district_id: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVenue = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/owner/wedding_hall/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFormData(res.data.venue);
            } catch (err) {
                console.error(err);
                setError('Failed to load venue');
            } finally {
                setLoading(false);
            }
        };

        fetchVenue();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/owner/wedding_hall/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage(res.data.message);
            navigate('/owner/own-wedding_hall');
        } catch (err) {
            console.error(err);
            setError('Failed to update venue');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold text-pink-700 mb-4">Edit Venue</h2>
            {loading ? (
                <p className="text-gray-600 text-center">Loading...</p>
            ) : (
                <>
                    {message && <p className="text-green-600">{message}</p>}
                    {error && <p className="text-red-600">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Venue Name"
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                        <input
                            type="number"
                            name="seat_price"
                            value={formData.seat_price}
                            onChange={handleChange}
                            placeholder="Seat Price"
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                        <select
                            name="district_id"
                            value={formData.district_id}
                            onChange={handleChange}
                            className="w-full border px-4 py-2 rounded"
                            required
                        >
                            <option value="">Select a district</option>
                            {districts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
                        >
                            Update Venue
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default UpdateVenue;