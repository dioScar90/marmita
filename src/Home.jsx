import { aee } from './firebase'

const Home = () => {
  const mama = async () => {
    const phoneNumbersList = await aee()
    console.log('phoneNumbersList', phoneNumbersList)
  }

  return (
    <>
      <h1>Home</h1>
      <p>This is home from {import.meta.env.VITE_TITLE_MAIN}</p>
      <button onClick={mama}>Clique</button>
    </>
  )
}

export default Home
