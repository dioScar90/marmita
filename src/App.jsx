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

const NotFound = () => <div>Not foud</div>

const namesToCreateObj = ['Diogo', 'Karla', 'Lucas', 'Pablo', 'Fabrício']
const names = namesToCreateObj.map(name => ({ name, nameId: crypto.randomUUID() }))

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

const defaultPhonesLoader = async ({ seed, uuid }) => {
  const hasSeedAndUuid = seed && uuid
  
  const minimumInc = ['gender', 'name', 'email', 'cell', 'login']
  const picture = hasSeedAndUuid ? ['picture'] : []
  const inc = [...minimumInc, ...picture].join(',')
  
  const nat = 'br'
  const results = 5

  const urlParams = new URLSearchParams({ seed: (seed ?? ''), results, nat, inc }).toString()
  const url = `https://randomuser.me/api/?${urlParams}`
  const { data } = await axios.get(url)
  
  if (hasSeedAndUuid) {
    const [ specificData ] = data.results.filter(a => a.login.uuid === uuid)
    return { ...specificData, seed: data.info.seed }
  }

  return data.results.map((item) => ({ ...item, seed: data.info.seed }))
}

const phonesLoader = async () => await defaultPhonesLoader({})
const phonesLoaderWithSeed = async ({ params: { seed } }) => await defaultPhonesLoader({ seed })
const phonesLoaderWithUUID = async ({ params: { seed, uuid } }) => await defaultPhonesLoader({ seed, uuid })

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
        <Route path=":id" element={<NameDetails names={names} />} />
        <Route path=":id/edit" element={<NameDetails names={names} />} />
        <Route path=":id/delete" element={<NameDetails names={names} />} />
        <Route path="new" element={<FormName names={names} />} />
      </Route>

      <Route path="phones" element={<PhonesLayout />}>
        <Route index element={<Phones />} loader={phonesLoader} />
        <Route path=":seed" element={<Phones />} loader={phonesLoaderWithSeed} />
        <Route path=":seed/:uuid" element={<PhoneDetails />} loader={phonesLoaderWithUUID} />
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
