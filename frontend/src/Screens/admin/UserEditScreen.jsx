import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import FormContainer from "../../Components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import Meta from "../../Components/Meta";

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    error,
    refetch,
    isLoading,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const updateUserHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser({ userId, name, email, isAdmin });
      if (res.error) throw res.error;
      toast.success("המשתמש עודכן בהצלחה", {
        toastId: "toastSuccess1",
      });
      refetch();
      navigate("/admin/userlist");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "שגיאה בעדכון משתמש", {
        toastId: "toastError1",
      });
    }
  };

  return (
    <>
      <Meta title={"עריכת משתמש | Jobify"} />
      <Link to="/admin/userlist" className="btn btn-light my-3">
        חזרה למשתמשים
      </Link>
      <FormContainer>
        <h1>עריכת משתמש</h1>
        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            <Form onSubmit={updateUserHandler}>
              <Form.Group controlId="name" className="my-2">
                <Form.Label>שם מלא של המשתמש</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="הכנס שם"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="email" className="my-2">
                <Form.Label>דוא"ל</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={`הכנס דוא"ל`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="isAdmin" className="my-2">
                <Form.Check
                  type="checkbox"
                  label="האם מנהל?"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
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
export default UserEditScreen;
