import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Welcome from './components/welcome';
import Register from './components/register';
import Create from './components/create';
import Update from './components/update';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Welcome />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Register />} />
      <Route path='/createRoute' element={<Create />} />
      <Route path='/updateRoute' element={<Update />} />
    </Routes>
  );
}

export default App;