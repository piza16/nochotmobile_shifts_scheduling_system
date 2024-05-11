import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import Meta from "../Components/Meta";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("ההזמנה סומנה כנשלחה", {
        toastId: "toastSuccess1",
      });
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || "שגיאה בסימון ההזמנה כנשלחה",
        {
          toastId: "toastError1",
        }
      );
    }
  };

  useEffect(() => {
    if (!errorPayPal && !loadingPaypal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "ILS",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, errorPayPal, loadingPaypal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("התשלום בוצע בהצלחה", {
          toastId: "toastSuccess1",
        });
      } catch (err) {
        toast.error(err?.data?.message || err?.message || "שגיאה בתשלום", {
          toastId: "toastError1",
        });
      }
    });
  }

  function onError(err) {
    toast.error(err?.message || err?.data?.message || "שגיאה בתשלום", {
      toastId: "toastError1",
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <Meta title={"סטטוס הזמנה | Jobify"} />
      <h1 className="mt-3">הזמנה מספר {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>משלוח</h2>
              <p>
                <strong>שם: </strong> {order.user.name}
              </p>
              <p>
                <strong>דוא"ל: </strong> {order.user.email}
              </p>
              <p>
                <strong>כתובת למשלוח: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  נשלח בתאריך {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">טרם נשלח</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>תשלום</h2>
              <p>
                <strong>שיטת תשלום: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">שולם בתאריך {order.paidAt}</Message>
              ) : (
                <Message variant="danger">טרם שולם</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>פריטים בהזמנה זו</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x ₪{item.price} = ₪
                      {(item.qty * item.price).toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>סיכום הזמנה</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>פריטים</Col>
                  <Col>₪{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>משלוח</Col>
                  <Col>₪{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>מע"מ (17%)</Col>
                  <Col>₪{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>סה"כ לתשלום</Col>
                  <Col>₪{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <button
                      type="button"
                      className="btn btn-block btn-primary"
                      onClick={deliverOrderHandler}
                    >
                      סמן כנשלח
                    </button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
