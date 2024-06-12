import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite'

const firebaseConfig = {
  // apiKey: 'AIzaSyDvnAIHgMTDOwrGWt7KBKfdCLCfyCjSPao',
  // authDomain: 'marmita-b9102.firebaseapp.com',
  // projectId: 'marmita-b9102',
  // storageBucket: 'marmita-b9102.appspot.com',
  // messagingSenderId: '177429942805',
  // appId: '1:177429942805:web:e2752454677b3427fef41c',
  // measurementId: 'G-5D8FFB23X7'
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,

  // optional...
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function getPhoneNumbers(db) {
  const marmitaCol = collection(db, 'phoneNumbers')
  const phoneNumbersSnapshot = await getDocs(marmitaCol)
  const phoneNumbersList = phoneNumbersSnapshot.docs.map((doc) => doc.data())
  return phoneNumbersList
  // console.log('phoneNumbersList', phoneNumbersList)
}

const aee = async () => await getPhoneNumbers(db)

export { aee }