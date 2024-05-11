import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Card } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import Meta from "../../Components/Meta";

const OrderListScreen = () => {
  const { data: orders, error, isLoading } = useGetOrdersQuery();

  return (
    <>
      <Meta title={"רשימת כל ההזמנות | Jobify"} />
      <h1>הזמנות</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>מספר הזמנה</th>
                <th>משתמש</th>
                <th>תאריך</th>
                <th>סה"כ</th>
                <th>שולם</th>
                <th>נשלח</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        פרטים
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  );
};
export default OrderListScreen;
