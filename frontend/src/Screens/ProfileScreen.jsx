import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Table, Button, Row, Col, Card, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";
import { FaTimes } from "react-icons/fa";
import Message from "../Components/Message";
import {
  useProfileMutation,
  useUploadUserProfileImageMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Meta from "../Components/Meta";

const ProfileScreen = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateUserProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const [uploadUserProfileImage, { isLoading: loadingUpload }] =
    useUploadUserProfileImageMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setImage(userInfo.image);
    }
  }, [userInfo, userInfo.name, userInfo.email, userInfo.image]);

  const updateUserProfileHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("עימות סיסמא נכשל - הסיסמאות לא זהות", {
        toastId: "toastError1",
      });
    } else {
      try {
        const res = await updateUserProfile({
          _id: userInfo._id,
          name,
          password,
          image,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("פרטי המשתמש עודכנו בהצלחה", {
          toastId: "toastSuccess2",
        });
      } catch (err) {
        toast.error(
          err?.data?.message || err.error || "נכשל עדכון פרטי המשתמש",
          {
            toastId: "toastError2",
          }
        );
      }
    }
  };

  const uploadFileHandler = async (e) => {
    const fileInput = e.target;
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    try {
      const res = await uploadUserProfileImage(formData).unwrap();
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
      <Row>
        <Meta title={"פרופיל משתמש | NOC shift"} />
        <Col md={3}>
          <h2>פרופיל משתמש</h2>
          <Image
            src={image}
            roundedCircle={true}
            style={{ height: "100px", width: "100px" }}
          />
          <Form onSubmit={updateUserProfileHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>שם מלא</Form.Label>
              <Form.Control
                type="name"
                disabled={true}
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
            <Form.Group controlId="image" className="my-2">
              <Form.Label>תמונת פרופיל</Form.Label>
              <Form.Control
                type="text"
                placeholder="בצע העלאת תמונה"
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
