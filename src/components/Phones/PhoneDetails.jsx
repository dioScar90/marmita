import { Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Link, useLoaderData } from 'react-router-dom'
import { Navigate } from 'react-router-dom/dist'

// eslint-disable-next-line react/prop-types
const DataList = ({ header, body }) => {
  return (
    <dl className="row m-0">
      <dt className="fw-bold small col-4">{header}</dt>
      <dd className="col-8 m-0">{body}</dd>
    </dl>
  )
}

const PhoneDetails = () => {
  const { person } = useLoaderData() ?? {}

  if (!person) {
    return <Navigate to='/' />
  }

  const LINK_TO = '/phones/' + person.seed

  return (
    <>
      <h1>Telefone específico</h1>
      
      <Row className="justify-content-md-center">
        <Col >
          <Card border={person.gender === 'male' ? 'info' : 'warning'}>
            <Row className="justify-content-md-center">
              <Col xs={6}>
                <Card.Img variant="bottom" src={person.picture.large} />
              </Col>
            </Row>
            <Card.Body>
              <Card.Title>{person.name.title + '. ' + person.name.first + ' ' + person.name.last}</Card.Title>
              <Card.Text>
                Here is some example of a card using <Link to="https://randomuser.me/" target="_blank">Random User Generator API</Link>.
              </Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <DataList header="Nome Popular" body={person.name.first} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <DataList header="Nome Científico" body={person.name.title + '. ' + person.name.first + ' ' + person.name.last} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <DataList header="Telefone" body={person.cell} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <DataList header="Email" body={person.email} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <Link to={LINK_TO}>Voltar</Link>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PhoneDetails
