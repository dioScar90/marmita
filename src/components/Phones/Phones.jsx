import Badge from 'react-bootstrap/Badge'
import Image from 'react-bootstrap/Image'
import Table from 'react-bootstrap/Table'
import { Link, useLoaderData } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
const TableRow = ({ gender, name, email, cell, login, picture, seed }) => {
  const linkTo = '/phones/' + seed + '/' + login.uuid

  return (
    <tr className="" data-name-id={seed} data-name={name.first} draggable="true">
      {/* <th scope="row"></th> */}
      <th scope="row">
        <Image src={picture.thumbnail} thumbnail />
      </th>
      <td>
        <Link to={linkTo}>
          <Badge pill bg={gender === 'male' ? 'info' : 'warning'} text="dark">
            {name.title + '. ' + name.first + ' ' + name.last}
          </Badge>
        </Link>
      </td>
      <td className="col col-md-3">
        {cell}
      </td>
      <td className="col col-md-2">
        {email}
      </td>
    </tr>
  )
}

const Phones = () => {
  const { people } = useLoaderData() ?? {}
  
  return (
    <>
      <h1>Todos os telefones</h1>

      <Table striped bordered hover id="table_phones">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nome</th>
            <th scope="col">Telefone</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {people?.map((p) => <TableRow key={p.login.uuid} {...p} />)}
        </tbody>
      </Table>
    </>
  )
}

export default Phones

