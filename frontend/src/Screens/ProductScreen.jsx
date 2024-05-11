import { useState, useEffect } from "react";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import { addToCart } from "../slices/cartSlice";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Container,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Rating from "../Components/Rating";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { toast } from "react-toastify";
import Meta from "../Components/Meta";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { data: orders, isLoading: loadingOrders } = useGetMyOrdersQuery();

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const isUserPurchasedProduct = async () => {
      if (userInfo && orders) {
        const purchased = orders.filter((order) =>
          order.orderItems.find((item) => item.product === productId)
        );
        const purchasedAndPaid = purchased.filter((order) => order.isPaid);
        setIsPurchased(purchasedAndPaid.length > 0);
      } else {
        setIsPurchased(false);
      }
    };
    isUserPurchasedProduct();
  }, [productId, orders, userInfo]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const createReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("הביקורת נוספה", {
        toastId: "toastSuccess1",
      });
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "שגיאה בהוספת ביקורת", {
        toastId: "toastError1",
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Container style={{ marginTop: "30px" }}>
          <Message variant="danger">
            {error?.data.message || error.error}
          </Message>
        </Container>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <Link className="btn btn-light my-3" to="/">
            חזרה
          </Link>
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid rounded />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush" className="listGroup">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    numReviews={product.numReviews}
                  />
                </ListGroup.Item>
                <ListGroup.Item>מחיר: ₪{product.price}</ListGroup.Item>
                <ListGroup.Item>מפרט: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>מחיר:</Col>
                      <Col>
                        <strong>₪{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>סטטוס:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "זמין במלאי"
                            : "המוצר חסר"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>כמות</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      הוסף לעגלה
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review">
            <Col md={6}>
              <h2>ביקורות</h2>
              {product.reviews.length === 0 && (
                <Message>אין ביקורות למוצר זה</Message>
              )}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>הוסף ביקורת</h2>
                  {(loadingReview || loadingOrders) && <Loader />}
                  {!userInfo ? (
                    <Message>
                      אנא <Link to="/login">התחבר כאן</Link> ורכוש מוצר זה כדי
                      להוסיף ביקורת עליו
                    </Message>
                  ) : !isPurchased ? (
                    <Message>
                      עליך לרכוש מוצר זה על מנת להוסיף ביקורת עליו
                    </Message>
                  ) : (
                    <Form onSubmit={createReviewHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>דרג את המוצר שרכשת</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="">בחר...</option>
                          <option value="1">1 - גרוע</option>
                          <option value="2">2 - לא רע</option>
                          <option value="3">3 - בסדר</option>
                          <option value="4">4 - טוב</option>
                          <option value="5">5 - מצוין</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment" className="my-2">
                        <Form.Label>הוסף כמה מילים על המוצר</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loadingReview}
                      >
                        שלח ביקורת
                      </Button>
                    </Form>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
export default ProductScreen;
