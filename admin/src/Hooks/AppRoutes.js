import { Route, Routes } from 'react-router-dom'
import Reservations from '../Pages/Reservations'
import Tarifs from '../Pages/Tarifs'
import Settings from '../Pages/Settings'
import NotFound from '../Pages/NotFound'
import Home from '../Pages/Home'
import Stats from '../Pages/Stats'
import Login from '../Pages/Login'
import ReservationDetails from '../Pages/ReservationDetails'

export default function AppRoutes() {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/stats' element={<Stats />} />
        <Route path='/reservations' element={<Reservations />} />
        <Route path='/reservation/:ID' element={<ReservationDetails />} />
        <Route path='/tarifs' element={<Tarifs />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />
    </Routes>
  )
}
