import axios from "axios";
import { useNavigate } from "react-router-dom";

const Modal = ({ route, closeModal, user, getData }) => {
    const logged = sessionStorage.getItem('logged');

    const imageUrl = "http://127.0.0.1:8000/storage/" + route.picture;
    const token = sessionStorage.getItem('token');
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const navigate = useNavigate()

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/routes/${route.id}}/delete`, {
                headers: headers
            });
            closeModal()
            getData()
            navigate('/')
        } catch (error) {
            console.log('There was an error deleting the route ');
        }
    };

    const editRoute = () => {
        navigate('/updateRoute',{state : {route:route}})
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>

                <div className="image">
                    <img src={imageUrl} alt="picture" />
                </div>
                <div className="modal-text">
                    <h2>{route.title}</h2>
                    <h4>{route.category.name}</h4>
                    <p>Duration: {route.duration} Days</p>
                    <h3>Destinations:</h3>
                    <ul className="myLists">
                        {route.destinations.map(dest => (
                            <li class="list modal-list">
                                <div>
                                    <i class="fa-solid fa-location-dot"></i>
                                    <span style={{ color: '#A0643D', fontWeight: 500 }}>{dest.name}</span>
                                </div>
                                <span style={{ color: '#000', marginLeft: '15px' }}>Location : {dest.location}</span>
                                <div className="recoms">
                                    <ul style={{ color: '#000', marginLeft: '25px' }}>
                                        {JSON.parse(dest.recommendations).map(recommendation => (
                                            <li>{recommendation}</li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="modal-footer">
                        <p style={{ color: '#9ca3af' }}>By {route.user.name}</p>
                        {
                            logged ? user.id === route.user.id ?
                                <div className="botonat">
                                    <button type="button"><i className="fa-solid fa-pen" onClick={()=>editRoute()}></i></button>
                                    <button type="button" onClick={handleDelete}><i className="fa-solid fa-trash"></i></button>
                                </div>
                                : ''
                                : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;