import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './components/Home'
import Names from './components/Names/Names'
import Phones from './components/Phones/Phones'
import NameDetails from './components/Names/NameDetails'
import PhoneDetails from './components/Phones/PhoneDetails'
import Header from './components/Header'
import Footer from './components/Footer'

const NotFound = () => <div>Not foud</div>

const names = () => ({})
const phones = () => ({})

const NamesLayout = () => {
  return (
    <>
      <Header />
      <div id="container">
        Names
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

const PhonesLayout = () => {
  return (
    <>
      <Header />
      <div id="container">
        Phones
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      
      <Route path="about" element={<Home />} />

      <Route path="names" element={<NamesLayout />}>
        <Route index element={<Names names={names} />} />
        <Route path=":id" element={<NameDetails />} />
      </Route>

      <Route path="phones" element={<PhonesLayout />}>
        <Route index element={<Phones phones={phones} />} />
        <Route path=":id" element={<PhoneDetails />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const App = () => <RouterProvider router={router} />

export default App

