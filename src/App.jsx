import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Container from 'react-bootstrap/Container'
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './Home'
import Names from './components/Names/Names.jsx'
import Phones from './components/Phones/Phones.jsx'
import NameDetails from './components/Names/NameDetails'
import PhoneDetails from './components/Phones/PhoneDetails'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

const NotFound = () => <div>Not foud</div>

const names = [1, 2, 3, 4, 5]
const phones = () => ({})

const NamesLayout = () => {
  return (
    <>
      <Header />
      <Container>
        Names
        <Outlet />
      </Container>
      <Footer />
    </>
  )
}

const PhonesLayout = () => {
  return (
    <>
      <Header />
      <Container>
        Phones
        <Outlet />
      </Container>
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
