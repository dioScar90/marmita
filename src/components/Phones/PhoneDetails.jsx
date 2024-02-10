import { useParams } from 'react-router-dom'

const PhoneDetails = () => {
  const { id } = useParams()

  return (
    <>
      <h1>PhoneDetails - id: {id}</h1>
      <hr />
      <div>
        <dl id="dl-details" className="row">
          <dt className="col-sm-2">Nome Popular</dt>
          <dd className="col-sm-10">Diogo</dd>

          <dt className="col-sm-2">Nome Científico</dt>
          <dd className="col-sm-10">O brabo tem nome</dd>

          <dt className="col-sm-2">Família</dt>
          <dd className="col-sm-10">Scarmagnani</dd>

          <dt className="col-sm-2">Interesse Médico</dt>
          <dd className="col-sm-10">Apenas das loiras odonto</dd>
        </dl>
      </div>
    </>
  )
}

export default PhoneDetails
