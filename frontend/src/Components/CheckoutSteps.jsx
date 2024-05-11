import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center mb-4">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/">
            <Nav.Link>
              <strong>עמוד ראשי</strong>
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>עמוד ראשי</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/shipping">
            <Nav.Link>
              <strong>כתובת משלוח</strong>
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <strong>כתובת משלוח</strong>
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to="/payment">
            <Nav.Link>
              {" "}
              <strong>שיטת תשלום</strong>
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            {" "}
            <strong>שיטת תשלום</strong>
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link>
              {" "}
              <strong>ביצוע הזמנה</strong>
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            {" "}
            <strong>ביצוע הזמנה</strong>
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
