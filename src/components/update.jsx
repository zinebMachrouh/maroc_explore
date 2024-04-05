import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import axios from 'axios';


const Update = () => {
    const location = useLocation();
    const route = location.state.route

    const [formData, setFormData] = useState({
        title: route.title,
        category_id: route.category.id,
        duration: route.duration,
        picture: null,
        destinations: route.destinations.map(dest => dest.id) 
    });
    const navigate = useNavigate();


    const categories = JSON.parse(sessionStorage.getItem('categories'))
    const destinations = JSON.parse(sessionStorage.getItem('destinations'))
    const token = sessionStorage.getItem('token');

    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const handleInputChange = (e) => {
        if (e.target.name === 'picture') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else if (e.target.name === 'destinations') {
            const isChecked = e.target.checked;
            const destId = parseInt(e.target.value);
            if (isChecked) {
                setFormData({ ...formData, destinations: [...formData.destinations, destId] });
            } else {
                setFormData({ ...formData, destinations: formData.destinations.filter(id => id !== destId) });
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'destinations') {
                value.forEach(id => form.append(key + '[]', id));
            } else {
                form.append(key, value);
            }
        });

        try {
            await axios.put(`http://127.0.0.1:8000/api/routes/${route.id}/update`, form, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/');
        } catch (error) {
            // Handle error
            console.error('Error creating route:', error);
        }
    };

    return (
        <div id="signup-body">
            <Link to='/' className="back">
                <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <div class="form-container">
                <h2 className="log-title">Create Route</h2>
                <form class="form" method="POST" onSubmit={handleFormSubmit} encType="multipart/form-data">
                    <div class="input-group">
                        <label for="title">Title</label>
                        <input type="text" name="title" id="title" placeholder="Enter Title" value={formData.title} onChange={handleInputChange} />
                    </div>

                    <div className="input-group">
                        <label htmlFor="category_id">Category</label>
                        <select name="category_id" id="category_id" onChange={handleInputChange} value={formData.category_id}>
                            <option value="" hidden>Pick Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div class="input-group">
                        <label for="duration">Duration</label>
                        <input type="number" name="duration" id="duration" placeholder="Enter Duration" value={formData.duration} onChange={handleInputChange} />
                    </div>

                    <div className="input-group">
                        <label for="picture">Picture</label>
                        <input type="file" name="picture" id="picture" onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="destinations">Destinations</label>
                        <div className="dests">
                            {destinations.map(dest => (
                                <div className="dest">
                                    <input type="checkbox" key={dest.id} value={dest.id} name="destinations" checked={formData.destinations.includes(dest.id)} onChange={handleInputChange} />
                                    <span>{dest.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button class="sign" type="submit">Create</button>
                </form>
            </div>
        </div>
    );

}


export default Update;