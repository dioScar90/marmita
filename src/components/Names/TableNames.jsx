import { nanoid } from 'nanoid'

const EmptyTableBody = () => {
  return (
    <tbody className="for-empty-table">
      <tr>
        <td colSpan={100}>
          <div className="alert alert-warning mb-0 text-center">
            <h4 className="alert-heading mb-0" data-content="" data-en="Empty Table!" data-pt-br="Tabela Vazia!"></h4>
            <p className="mb-0" data-content="" data-en="There is no data to be shown at the moment." data-pt-br="No momento não há dados para serem exibidos."></p>
          </div>
        </td>
      </tr>
    </tbody>
  )
}

const TableRow = ({ names }) => {
  return (
    <tbody>
      {
        names.map(() => {
          const nameId = nanoid()

          return (
            <tr key={nameId} className="" data-name-id={nameId} data-name="Diogo" draggable="true">
              <th scope="row"></th>
              <td>
                Diogo
              </td>
              <td className="col col-md-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id={`status_${nameId}`} defaultChecked data-status="" />
                  <label className="form-check-label fw-bold" htmlFor={`status_${nameId}`} data-ativo="Ativo" data-inativo="Inativo" />
                </div>
              </td>
              <td className="col col-md-2">
                <div className="row">
                  <div className="col px-1">
                    <button type="button" className="btn btn-outline-danger btn-sm m-0" data-remove="">
                      <i className="far fa-trash-alt" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className="col px-1" hidden>
                    <button type="button" className="btn btn-outline-warning btn-sm m-0" data-order="down">
                      <i className="fa-solid fa-caret-down" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div className="col px-1" hidden>
                    <button type="button" className="btn btn-outline-success btn-sm m-0" data-order="up">
                      <i className="fa-solid fa-caret-up" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )
        })
      }
    </tbody>
  )
}

const TableNames = ({ names }) => {
  console.log('names', names)
  return (
    <table className="table table-striped table-dark table-hover" id="table_names">
      <thead className="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col" data-content="" data-en="Name" data-pt-br="Nome"></th>
          <th scope="col" data-content="" data-en="Status" data-pt-br="Status"></th>
          <th scope="col" data-content="" data-en="Actions" data-pt-br="Ações"></th>
        </tr>
      </thead>

      {names.length === 0 ? <EmptyTableBody /> : <TableRow names={names} />}
    </table>
  )
}

export default TableNames

