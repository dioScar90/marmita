
const TableRow = (a) => {
  return (
    <tr key={a} className="" data-name-id="f5feaff6-07ad-4af5-a122-b8aaeb8059df" data-name="Diogo" draggable="true">
      <th scope="row"></th>
      <td>
        Vish
      </td>
      <td className="col col-md-3">
        Ave
      </td>
      <td className="col col-md-2">
        Sobrenatural
      </td>
    </tr>
  )
}

const Phones = () => {
  return (
    <>
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

export default Phones

