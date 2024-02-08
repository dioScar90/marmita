import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './Home'
import Names from './Names'
import Phones from './Phones'
import NameDetails from './NameDetails'
import PhoneDetails from './PhoneDetails'
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
        <Route path=":id" element={<NameDetails names={names} />} />
      </Route>

      <Route path="phones" element={<PhonesLayout />}>
        <Route index element={<Phones phones={phones} />} />
        <Route path=":id" element={<PhoneDetails phones={phones} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const App = () => <RouterProvider router={router} />

export default App
