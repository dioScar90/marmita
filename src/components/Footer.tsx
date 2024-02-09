
const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="container mt-5">
      <h5 className="text-center">
        &copy; <span id="current_year">{currentYear}</span> | Marmitas S.A.
      </h5>
    </footer>
  )
}

export default Footer

