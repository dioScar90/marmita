const NameDList = ({ name }) => {
  return (
    <dl className="row justify-content-center mb-0">
      <dt className="col-4 col-md-2 mb-1">
        <span className="name-to-order">{name}</span>
      </dt>

      <dd className="col-8 col-md-auto mb-1 row">
        <div className="col-auto align-items-center">
          <div className="form-check">
            <input className="form-check-input" type="radio" data-type="1" name={name} id={`radio_1_${Diogo}`} value="1P" />
            <label className="form-check-label" for={`radio_1_${Diogo}`} data-nomes="" data-tamanho="P">
              Op. 1
            </label>
          </div>

          <div className="tamanho">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id={`switch_1_${Diogo}`} />
              <label className="form-check-label" for={`switch_1_${Diogo}`}>M</label>
            </div>
          </div>
        </div>

        <div className="col-auto align-items-center">
          <div className="form-check">
            <input className="form-check-input" type="radio" data-type="2" name="Diogo" id="radio_2_Diogo" value="2P" />
            <label className="form-check-label" for="radio_2_Diogo" data-nomes="" data-tamanho="P">
              Op. 2
            </label>
          </div>

          <div className="tamanho">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="switch_2_Diogo" />
              <label className="form-check-label" for="switch_2_Diogo">M</label>
            </div>
          </div>
        </div>
      </dd>
    </dl>
  )
}

export default NameDList
