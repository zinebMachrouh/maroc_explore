import { useState } from "react";
import Modal from "./modal";
import axios from "axios";

const Route = ({ route,user, getData }) => {
    const token = sessionStorage.getItem('token');
    const logged = sessionStorage.getItem('logged');

    const [showModal, setShowModal] = useState(false);
    const [added, setAdded] = useState(route.added)
    const openModal = () => {
        setShowModal(true);
    };
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const addToWatchlist = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/addToWatchlist/${route.id}`, {
                headers: headers
            });
            setAdded(response.data.added);
        } catch (error) {
            console.error('There was an error adding the route to the watchlist: ', error);
        }
    };
    const closeModal = () => {
        setShowModal(false);
    };
    return (
        <section>
            <div className="card">
                <div class="card-header">
                    <span class="title">{route.category.name}</span>
                    <span class="price text-trim" >{route.title}</span>
                </div>
                <p class="desc">Duration : {route.duration} Days</p>
                <ul class="lists">
                    {route.destinations.map(dest => (
                        <li class="list">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>{dest.name}</span>
                        </li>))}

                </ul>
                <div className="buttons">
                    <button type="button" class="action" onClick={openModal}>View Details</button>
                    {
                        logged ? <button type="button" onClick={addToWatchlist} className="wishlist">
                            {
                                added ? <i class="fa-solid fa-star"></i> : <i class="fa-regular fa-star"></i>
                            }
                        </button> : ''
                    }
                </div>
            </div>
            {showModal && <Modal route={route} closeModal={closeModal} user={user} getData={getData} />}
        </section>
    );
}

export default Route;