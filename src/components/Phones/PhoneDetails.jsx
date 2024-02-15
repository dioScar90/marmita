import { Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Link, redirect, useLoaderData } from 'react-router-dom'

const PhoneDetails = () => {
  const phoneDetails = useLoaderData()
  
  if (!phoneDetails) {
    return redirect('/phones')
  }
  
  const linkTo = '/phones/' + phoneDetails.seed

  return (
    <Row className="justify-content-md-center">
      <Col xs={10} md={6}>
      <Card border={phoneDetails.gender === 'male' ? 'info' : 'warning'}>
        <Card.Img variant="" src={phoneDetails.picture.large} />
        <Card.Body>
          <Card.Title>{phoneDetails.name.title + '. ' + phoneDetails.name.first + ' ' + phoneDetails.name.last}</Card.Title>
          <Card.Text>
            Here is some example of a card using Random User Generator API.
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <div className="fw-bold small">Nome Popular</div>
              <div>{phoneDetails.name.first}</div>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="fw-bold small">Nome Científico</div>
              <div>{phoneDetails.name.title + '. ' + phoneDetails.name.first + ' ' + phoneDetails.name.last}</div>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="fw-bold small">Telefone</div>
              <div>{phoneDetails.cell}</div>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="fw-bold small">Email</div>
              <div>{phoneDetails.email}</div>
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
