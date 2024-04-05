import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Route from "./route";
import Destination from "./destination";

const Welcome = () => {
    const [state, setState] = useState({
        categories: [],
        routes: [],
        destinations: [],
        user: {},
        searchTerm: '',
        selectedOption: '',
        showModal : false
    })

    const logged = sessionStorage.getItem('logged');
    const token = sessionStorage.getItem('token');

    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const navigate = useNavigate()
    const getData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/routes', {
                headers: headers
            });
            setState(prevState => ({
                ...prevState,
                routes: response.data.routes,
                categories: response.data.categories,
                destinations: response.data.destinations,
                user: response.data.user
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = async () => {
        if (state.searchTerm.trim() === '') {
            getData();
        } else {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/routes/search', {
                    title: state.searchTerm
                });
                setState(prevState => ({
                    ...prevState,
                    routes: response.data.routes
                }));
            } catch (error) {
                console.error('Error searching routes:', error);
            }
        }
    };

    const handleFilter = async (e) => {
        const selectedValue = e.target.value;
        setState(prevState => ({
            ...prevState,
            selectedOption: selectedValue
        }));

        if (selectedValue) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/routes/filter', {
                    category: selectedValue
                });
                setState(prevState => ({
                    ...prevState,
                    routes: response.data.routes
                }));
            } catch (error) {
                console.error('Error filtering routes:', error);
            }
        } else {
            getData();
        }
    };
    const refreshToken = async () => {
        // const response = await axios.post('http://127.0.0.1:8000/api/refresh', {
        //     headers: headers
        // });

        // sessionStorage.setItem('token', response.data.authorisation.token);
    };

    const handleLogout = async () => {
        sessionStorage.clear()
        navigate('/');
    }

    const openModal = () => {
        setState(prevState => ({
            ...prevState,
            showModal: true
        }));
    };

    const closeModal = () => {
        setState(prevState => ({
            ...prevState,
            showModal: false
        }));
    };

    useEffect(() => {
        getData()

    }, [])

    useEffect(() => {
        handleSearch();
    }, [state.searchTerm])

    useEffect(() => {
        if (state.categories.length > 0) {
            sessionStorage.setItem('categories', JSON.stringify(state.categories));
        }
    }, [state.categories]);

    useEffect(() => {
        if (state.destinations.length > 0) {
            sessionStorage.setItem('destinations', JSON.stringify(state.destinations));
        }
    }, [state.destinations]);

    useEffect(() => {
        refreshToken();
        const intervalId = setInterval(refreshToken, 3600000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div id="welcome">
            <div className="hero">
                <div className="overlay"></div>
                <header>
                    <h2>Maroc <i className="fa-solid fa-moon"></i>xplore</h2>
                    <nav>
                        <NavLink to='/' end>Home</NavLink>
                        {logged ? (
                            <div>
                                <NavLink to='/createRoute'>Route</NavLink>
                                <a href="#" onClick={openModal}>Destination</a>
                                <a href='#' onClick={handleLogout}>LogOut</a>
                            </div>
                        ) : (
                            <div>
                                <NavLink to='/login'>Login</NavLink>
                                <NavLink to='/signup'>Signup</NavLink>
                            </div>
                        )}
                    </nav>
                </header>
                <div className="text">
                    <h2>Let's Explore Morocco Together!</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, laboriosam?</p>
                </div>
                <div className="actions">
                    <form method="post" className="search">
                        <input type="text" name="search" id="search" placeholder="Find Your Route..." value={state.searchTerm}
                            onChange={(e) => setState(prevState => ({ ...prevState, searchTerm: e.target.value }))} />
                        <button type="button"><i className="fa-solid fa-magnifying-glass"></i></button>
                    </form>
                </div>
            </div>
            <div className="container">
                <div className="top">
                    <h2>All Routes</h2>
                    <form action="" className="filter" method="post">
                        <select name="category_id" id="category_id" value={state.selectedOption} onChange={handleFilter}>
                            <option value="">Pick Category</option>
                            {state.categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </form>
                </div>
                <div className="body">
                    {state.routes.length === 0 ? (
                        <p>No routes found!</p>
                    ) : (
                        state.routes.map((route) => (
                            <Route key={route.id} route={route} user={state.user} getData={getData} />
                        ))
                    )}
                </div>
            </div>
            {state.showModal && <Destination closeModal={closeModal} />}
        </div>
    );
}

export default Welcome;
