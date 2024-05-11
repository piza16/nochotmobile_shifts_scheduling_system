import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import FormContainer from "../../Components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import Meta from "../../Components/Meta";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    error,
    isLoading,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const updateProductHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };
    const result = await updateProduct(updatedProduct);
    if (result.error) {
      toast.error(
        result.error?.data?.message ||
          result.error?.error ||
          "שגיאה בעדכון מוצר",
        {
          toastId: "toastError2",
        }
      );
    } else {
      toast.success("המוצר עודכן בהצלחה", {
        toastId: "toastSuccess2",
      });
      navigate("/admin/productlist");
    }
  };

  const uploadFileHandler = async (e) => {
    const fileInput = e.target;
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("התמונה הועלתה בהצלחה", {
        toastId: "toastSuccess1",
      });
      console.log(res.image);
      setImage(res.image);
    } catch (err) {
      fileInput.value = "";
      toast.error(err?.data?.message || err?.error || "שגיאה בהעלאת תמונה", {
        toastId: "toastError1",
      });
    }
  };

  return (
    <>
      <Meta title={"עריכת מוצר | Jobify"} />
      <Link to="/admin/productlist" className="btn btn-light my-3">
        חזרה למוצרים
      </Link>
      <FormContainer>
        <h1>עריכת מוצר</h1>
        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <>
            <Form onSubmit={updateProductHandler}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>שם המוצר</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="הכנס שם"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="price" className="my-2">
                <Form.Label>מחיר</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="הכנס מחיר"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="image" className="my-2">
                <Form.Label>תמונה</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="הכנס קישור לתמונה"
                  value={image}
                  onChange={(e) => setImage}
                ></Form.Control>
                <Form.Control
                  type="file"
                  Label="בחר קובץ"
                  onChange={uploadFileHandler}
                ></Form.Control>
                {loadingUpload && <Loader />}
              </Form.Group>

              <Form.Group controlId="brand" className="my-2">
                <Form.Label>מותג</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="הכנס מותג"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="countInStock" className="my-2">
                <Form.Label>כמות במלאי</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="הכנס כמות במלאי"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="category" className="my-2">
                <Form.Label>קטגוריה</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="הכנס קטגוריה"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="description" className="my-2">
                <Form.Label>תיאור המוצר</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="הכנס תיאור"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Button type="submit" variant="primary" className="my-2">
                עדכן
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </>
  );
};
export default ProductEditScreen;
