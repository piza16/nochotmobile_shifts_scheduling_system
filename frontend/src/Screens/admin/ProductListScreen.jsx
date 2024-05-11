import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Card, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import Paginate from "../../Components/Paginate";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import Meta from "../../Components/Meta";

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, error, isLoading, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteProductHandler = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק מוצר זה?")) {
      try {
        await deleteProduct(id);
        toast.success("המוצר נמחק", {
          toastId: "toastSuccess1",
        });
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err?.error || "שגיאה במחיקת מוצר", {
          toastId: "toastError1",
        });
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("האם אתה בטוח שברצונך ליצור מוצר חדש?")) {
      try {
        await createProduct();
        toast.success("מוצר חדש נוצר", {
          toastId: "toastSuccess1",
        });
        refetch();
      } catch (err) {
        toast.error(
          err?.data?.message || err?.error || "שגיאה ביצירת מוצר חדש",
          {
            toastId: "toastError1",
          }
        );
      }
    }
  };

  return (
    <>
      <Meta title={"רשימת כל המוצרים | Jobify"} />
      <Row className="align-items-center">
        <Col>
          <h1>מוצרים</h1>
        </Col>
        <Col className="text-start">
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            הוסף מוצר <FaEdit />
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <Card>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>מזהה</th>
                <th>שם</th>
                <th>מחיר</th>
                <th>קטגוריה</th>
                <th>מותג</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            pages={data.pages}
            page={data.page}
            isAdmin={true}
            className="my-2"
          />
        </Card>
      )}
    </>
  );
};
export default ProductListScreen;
