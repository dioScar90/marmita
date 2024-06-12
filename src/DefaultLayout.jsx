import Container from 'react-bootstrap/Container'
import Header from './components/Header'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom/dist'

const DefaultLayout = () => {
  return (
    <>
      <Header />

      <Container fluid>
        <Outlet />
      </Container>

      <Footer />
    </>
  )
}

export default DefaultLayout