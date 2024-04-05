import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Destination = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        recommendations: '',
    });
    const token = sessionStorage.getItem('token');
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://127.0.0.1:8000/api/destinations/create', formData, {
            headers: headers
        });
        closeModal()
        navigate(`/`);

    };
    return (
        <div className="modal">
            <div className="modal-dest">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Create Destination</h2>
                <form  className="create" method="post" onSubmit={handleSubmit}>
                    <div class="input-group">
                        <label for="name">Name</label>
                        <input type="text" name="name" id="name" placeholder="Enter Name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div class="input-group">
                        <label for="location">Location</label>
                        <input type="text" name="location" id="location" placeholder="Enter Location" value={formData.location} onChange={handleInputChange} />
                    </div>
                    <div class="input-group">
                        <label for="recommendations">Recommendations</label>
                        <input type="text" name="recommendations" id="recommendations" placeholder="Enter Recommendations" value={formData.recommendations} onChange={handleInputChange} />
                    </div>
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    );
}

export default Destination;