import Container from 'react-bootstrap/Container'
import Header from './components/Header'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom/dist'
import { useState } from 'react'

const DefaultLayout = () => {
  const [title, setTitle] = useState('Pedido de marmita');

  return (
    <>
      <Header />

      <Container fluid>
        <h1>{title}</h1>
        <Outlet context={{ setTitle }} />
      </Container>

      <Footer />
    </>
  )
}

export default DefaultLayout