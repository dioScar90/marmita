import { useEffect } from 'react'
import { Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Link, useLoaderData } from 'react-router-dom'
import { Navigate, useOutletContext } from 'react-router-dom/dist'

const DataList = ({ header, body }) =>
  <dl className="row m-0">
    <dt className="fw-bold small col-4">{header}</dt>
    <dd className="col-8 m-0">{body}</dd>
  </dl>

const PhoneDetails = ({ title }) => {
  const { setTitle } = useOutletContext()
  useEffect(() => setTitle(title), [title, setTitle])

  const phoneDetails = useLoaderData()

  if (!phoneDetails) {
    return <Navigate to='/' />
  }

  const linkTo = '/phones/' + phoneDetails.seed

  return (
    <Row className="justify-content-md-center">
      <Col >
        <Card border={phoneDetails.gender === 'male' ? 'info' : 'warning'}>
          <Row className="justify-content-md-center">
            <Col xs={6}>
              <Card.Img variant="bottom" src={phoneDetails.picture.large} />
            </Col>
          </Row>
          <Card.Body>
            <Card.Title>{phoneDetails.name.title + '. ' + phoneDetails.name.first + ' ' + phoneDetails.name.last}</Card.Title>
            <Card.Text>
              Here is some example of a card using <Link to="https://randomuser.me/" target="_blank">Random User Generator API</Link>.
            </Card.Text>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <DataList
                  header="Nome Popular"
                  body={phoneDetails.name.first}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <DataList
                  header="Nome Científico"
                  body={phoneDetails.name.title + '. ' + phoneDetails.name.first + ' ' + phoneDetails.name.last}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <DataList
                  header="Telefone"
                  body={phoneDetails.cell}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <DataList
                  header="Email"
                  body={phoneDetails.email}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Link to={linkTo}>Voltar</Link>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default PhoneDetails
