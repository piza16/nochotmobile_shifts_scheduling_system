import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../Components/FormContainer";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../Components/CheckoutSteps";
import Meta from "../Components/Meta";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <>
      <Meta title={"פרטי משלוח | Jobify"} />
      <FormContainer>
        <CheckoutSteps step1 step2 />

        <h2>כתובת למשלוח</h2>

        <form onSubmit={submitHandler}>
          <Form.Group controlId="address" className="my-2">
            <Form.Label>
              כתובת <strong className="text-danger">*</strong>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="הכנס כתובת"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="city" className="my-2">
            <Form.Label>
              עיר <strong className="text-danger">*</strong>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="הכנס עיר"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="postalCode" className="my-2">
            <Form.Label>מיקוד/ת.ד.</Form.Label>
            <Form.Control
              type="text"
              placeholder="הכנס מיקוד/ת.ד."
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="country" className="my-2">
            <Form.Label>
              מדינה <strong className="text-danger">*</strong>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="הכנס מדינה"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="my-3"
            disabled={address === "" || city === "" || country === ""}
          >
            המשך
          </Button>
        </form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
