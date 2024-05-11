import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { savePaymentMethod } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../Components/FormContainer";
import CheckoutSteps from "../Components/CheckoutSteps";
import Meta from "../Components/Meta";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal או כרטיס אשראי");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (
      Object.keys(shippingAddress).length === 0 ||
      shippingAddress?.address === "" ||
      shippingAddress?.city === "" ||
      shippingAddress?.country === ""
    ) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <>
      <Meta title={"שיטת תשלום | Jobify"} />
      <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <h1>שיטת תשלום</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as="legend">בחר שיטת תשלום</Form.Label>
            <Col>
              <Form.Check
                type="radio"
                className="my-4 mx-5"
                label="PayPal או כרטיס אשראי"
                id="PayPal"
                name="paymentMethod"
                value={"PayPal או כרטיס אשראי"}
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
              {/* <Form.Check
              type="radio"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check> */}
            </Col>
          </Form.Group>
          <Button type="submit" variant="primary">
            המשך
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
