import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom/dist'

const Home = ({ title }) => {
  const { setTitle } = useOutletContext()
  useEffect(() => setTitle(title), [title, setTitle])

  return <p>This is home</p>
}

export default Home
