const TableRow = (a) => {
  return (
    <tr key={a} className="" data-name-id="f5feaff6-07ad-4af5-a122-b8aaeb8059df" data-name="Diogo" draggable="true">
      <th scope="row"></th>
      <td>
        Diogo
      </td>
      <td className="col col-md-3">
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="status_0" checked="" data-status="" />
          <label className="form-check-label fw-bold" for="status_0" data-ativo="Ativo" data-inativo="Inativo"></label>
        </div>
      </td>
      <td className="col col-md-2">
        <div className="row">
          <div className="col px-1">
            <button type="button" className="btn btn-outline-danger btn-sm m-0" data-remove="">
              <i className="far fa-trash-alt" aria-hidden="true"></i>
            </button>
          </div>
          <div className="col px-1" hidden="">
            <button type="button" className="btn btn-outline-warning btn-sm m-0" data-order="down">
              <i className="fa-solid fa-caret-down" aria-hidden="true"></i>
            </button>
          </div>
          <div className="col px-1" hidden="">
            <button type="button" className="btn btn-outline-success btn-sm m-0" data-order="up">
              <i className="fa-solid fa-caret-up" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </td>
    </tr>
  )
}

const Names = () => {
  return (
    <>
      <h1>Names</h1>
      <table className="table table-striped table-dark table-hover" id="table_names">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col" data-content="" data-en="Name" data-pt-br="Nome"></th>
            <th scope="col" data-content="" data-en="Status" data-pt-br="Status"></th>
            <th scope="col" data-content="" data-en="Actions" data-pt-br="Ações"></th>
          </tr>
        </thead>

        <tbody className="for-empty-table">
          <tr>
            <td colspan="100%">
              <div className="alert alert-warning mb-0 text-center">
                <h4 className="alert-heading mb-0" data-content="" data-en="Empty Table!" data-pt-br="Tabela Vazia!"></h4>
                <p className="mb-0" data-content="" data-en="There is no data to be shown at the moment." data-pt-br="No momento não há dados para serem exibidos."></p>
              </div>
            </td>
          </tr>
        </tbody>

        <tbody>{[1, 2, 3, 4].map(TableRow)}</tbody>
      </table>
    </>
  )
}

export default Names

