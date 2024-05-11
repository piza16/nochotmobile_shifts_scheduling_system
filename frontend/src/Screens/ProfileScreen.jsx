import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Table, Button, Row, Col, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";
import { FaTimes } from "react-icons/fa";
import Message from "../Components/Message";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Meta from "../Components/Meta";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("עימות סיסמא נכשל - הסיסמאות לא זהות", {
        toastId: "toastError1",
      });
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("פרטי המשתמש עודכנו בהצלחה", {
          toastId: "toastSuccess1",
        });
      } catch (err) {
        toast.error(
          err?.data?.message || err.error || "נכשל עדכון פרטי המשתמש",
          {
            toastId: "toastError1",
          }
        );
      }
    }
  };

  return (
    <>
      <Row>
        <Meta title={"פרופיל משתמש | NOC shift"} />
        <Col md={3}>
          <h2>פרופיל משתמש</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>שם מלא</Form.Label>
              <Form.Control
                type="name"
                placeholder="הכנס שם"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>כתובת דוא"ל</Form.Label>
              <Form.Control
                type="email"
                disabled={true}
                placeholder={`הכנס דוא"ל`}
                value={email}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password" className="my-2">
              <Form.Label>סיסמא</Form.Label>
              <Form.Control
                type="password"
                placeholder="הכנס סיסמא"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="my-2">
              <Form.Label>עימות סיסמא</Form.Label>
              <Form.Control
                type="password"
                placeholder="הכנס סיסמא שוב"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2">
              עדכון פרופיל >
            </Button>
            {loadingUpdateProfile && <Loader />}
          </Form>
        </Col>
      </Row>
    </>
  );
};
export default ProfileScreen;
