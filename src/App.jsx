import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Container from 'react-bootstrap/Container'
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useLoaderData, useParams } from 'react-router-dom'
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
import axios from 'axios'
import localforage from 'localforage'
import DefaultLayout from './DefaultLayout'
import { redirect } from 'react-router-dom/dist'

const NotFound = () => <div>Not foud</div>

const namesToCreateObj = ['Diogo', 'Karla', 'Lucas', 'Pablo', 'Fabrício']
const names = namesToCreateObj.map(name => ({ name, nameId: crypto.randomUUID() }))

const NamesLayout = () => {
  return (
    <>
      <Header />

      <Container fluid>
        <h1>Names</h1>
        <Outlet />
      </Container>

      <Footer />
    </>
  )
}

const phonesLoader = async ({ params: { seed, uuid } }) => {
  const hasSeed = await localforage.getItem('seed')
  const hasPeople = await localforage.getItem('people')
  
  if (hasPeople && (!seed || hasSeed === seed)) {
    return { people: hasPeople }
  }
  
  const inc = ['gender', 'name', 'email', 'cell', 'login', 'picture'].join(',')
  const nat = 'br'
  const results = 10

  const urlParams = new URLSearchParams({ results, nat, inc }).toString()
  const url = `https://randomuser.me/api/?${urlParams}`
  const { data } = await axios.get(url)
  
  const people = data.results.map((item) => ({ ...item, seed: data.info.seed }))
  
  await localforage.setItem('seed', data.info.seed)
  await localforage.setItem('people', people)

  if (uuid) {
    const person = people?.find(p => p.login.uuid === uuid)
    return person ?? redirect('/')
  }
  
  return { people }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<DefaultLayout />} >
      <Route index element={<Home title="Home" />} />

      <Route path="about" element={<About />} />

      <Route path="names" element={<NamesLayout />}>
        <Route index element={<Names names={names} />} />
        <Route path=":id" element={<NameDetails names={names} />} />
        <Route path=":id/edit" element={<NameDetails names={names} />} />
        <Route path=":id/delete" element={<NameDetails names={names} />} />
        <Route path="new" element={<FormName names={names} />} />
      </Route>

      <Route path="phones">
        <Route index element={<Phones />} loader={phonesLoader} />
        <Route path=":seed" element={<Phones />} loader={phonesLoader} />
        <Route path=":seed/:uuid" element={<PhoneDetails />} loader={phonesLoader} />
        <Route path=":id/edit" element={<PhoneDetails />} />
        <Route path=":id/delete" element={<PhoneDetails />} />
        <Route path="new" element={<FormPhone />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

const App = () => <RouterProvider router={router} />

export default App
