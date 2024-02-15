// import Container from "react-bootstrap/Container"
// import Header from "./components/Header"
// import Footer from "./components/Footer"

import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom/dist'

const Home = ({ title }) => {
  const { setTitle } = useOutletContext()
  useEffect(() => setTitle(title), [title, setTitle])
  
  return (
    <>
      {/* <Header />
      <Container> */}
        <p>This is home</p>
      {/* </Container>
      <Footer /> */}
    </>
  )
}

export default Home

