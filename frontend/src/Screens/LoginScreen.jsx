import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../Components/FormContainer";
import Loader from "../Components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Meta from "../Components/Meta";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error, {
        toastId: "toastError1",
      });
    }
  };

  return (
    <>
      <Meta title={"התחברות | Jobify"} />
      <FormContainer>
        <h1 className="mt-5">כניסת משתמש</h1>

        <Form onSubmit={submitHandler}>
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

          <Button
            type="submit"
            variant="primary"
            className="my-2"
            disabled={isLoading}
          >
            התחבר
          </Button>

          {isLoading && <Loader />}
        </Form>

        <Row>
          <Col>
            משתמש חדש?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              <strong>הרשם כאן</strong>
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};
export default LoginScreen;
