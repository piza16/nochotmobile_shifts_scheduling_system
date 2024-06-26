import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-4">
            <p style={{ marginBottom: "0px" }}>
              NOC Shifts By Rotem Pizanti &copy; {currentYear}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
