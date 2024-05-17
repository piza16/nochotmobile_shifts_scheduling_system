import { Container, Row, Col } from "react-bootstrap";

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};
export default FormContainer;
