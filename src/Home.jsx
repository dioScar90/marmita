import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom/dist'
import { aee } from './firebase'

const Home = ({ title }) => {
  const { setTitle } = useOutletContext()
  useEffect(() => setTitle(title), [title, setTitle])

  const mama = async () => {
    const phoneNumbersList = await aee()
    console.log('phoneNumbersList', phoneNumbersList)
  }

  return (
    <>
      <p>This is home from {import.meta.env.VITE_TITLE_MAIN}</p>
      <button onClick={mama}>Clique</button>
    </>
  )
}

export default Home
