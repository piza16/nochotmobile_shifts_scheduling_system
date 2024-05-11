import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../Components/FormContainer";
import Loader from "../Components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Meta from "../Components/Meta";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("עימות סיסמא נכשל - הסיסמאות לא זהות", {
        toastId: "toastError1",
      });
      return;
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error, {
          toastId: "toastError1",
        });
      }
    }
  };

  return (
    <>
      <Meta title={"הרשמה | Jobify"} />
      <FormContainer>
        <h1 className="mt-5">הרשמה</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>שם מלא</Form.Label>
            <Form.Control
              type="text"
              placeholder="הכנס שם מלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>כתובת דוא"ל</Form.Label>
            <Form.Control
              type="email"
              placeholder={`הכנס דוא"ל`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>סיסמא</Form.Label>
            <Form.Control
              type="password"
              placeholder={`הכנס סיסמא`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>עימות סיסמא</Form.Label>
            <Form.Control
              type="password"
              placeholder={`הכנס סיסמא שוב`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button
            type="submit"
            variant="primary"
            className="my-2"
            disabled={isLoading}
          >
            הרשמה לאתר
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row>
          <Col>
            משתמש קיים?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              <strong>התחבר כאן</strong>
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};
export default RegisterScreen;
