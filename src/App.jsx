import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Container from 'react-bootstrap/Container'
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './Home'
import Header from './components/Header'
import Footer from './components/Footer'
import Names from './components/Names/Names'
import NameDetails from './components/Names/NameDetails'
import FormName from './components/Names/FormName'
import Phones from './components/Phones/Phones'
import PhoneDetails from './components/Phones/PhoneDetails'
import FormPhone from './components/Phones/FormPhone'
import About from './About'
import { nanoid } from 'nanoid'

const NotFound = () => <div>Not foud</div>

const namesToCreateObj = ['Diogo', 'Karla', 'Lucas', 'Pablo', 'Fabrício']
const names = namesToCreateObj.map(name => ({ name, nameId: nanoid() }))
const phones = [{}]

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

      <Route path="about" element={<About />} />

      <Route path="names" element={<NamesLayout />}>
        <Route index element={<Names names={names} />} />
        <Route path="new" element={<FormName names={names} />} />
        <Route path=":id" element={<NameDetails names={names} />} />
        <Route path=":id/edit" element={<NameDetails names={names} />} />
        <Route path=":id/delete" element={<NameDetails names={names} />} />
      </Route>

      <Route path="phones" element={<PhonesLayout />}>
        <Route index element={<Phones phones={phones} />} />
        <Route path="new" element={<FormPhone phones={phones} />} />
        <Route path=":id" element={<PhoneDetails phones={phones} />} />
        <Route path=":id/edit" element={<PhoneDetails phones={phones} />} />
        <Route path=":id/delete" element={<PhoneDetails phones={phones} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const App = () => <RouterProvider router={router} />

export default App
