import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Container from 'react-bootstrap/Container'
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './Home'
import Names from './components/Names/Names.jsx'
import NameDetails from './components/Names/NameDetails'
import FormName from './components/Names/FormName.jsx'
import Phones from './components/Phones/Phones.jsx'
import PhoneDetails from './components/Phones/PhoneDetails'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { nanoid } from 'nanoid'
import YourFormComponent from './components/Names/YourFormComponent.jsx'

const NotFound = () => <div>Not foud</div>

const names = [
  {
    name: 'Diogo',
    nameId: nanoid()
  },
  {
    name: 'Karla',
    nameId: nanoid()
  },
  {
    name: 'Lucas',
    nameId: nanoid()
  },
  {
    name: 'Pablo',
    nameId: nanoid()
  },
  {
    name: 'Fabrício',
    nameId: nanoid()
  }
]
const phones = () => ({})

const NamesLayout = () => {
  return (
    <>
      <Header />
      <Container>
        <h1>Names</h1>
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
        <h1>Phones</h1>
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
        <Route path="new" element={<FormName names={names} />} />
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
