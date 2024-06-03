import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import FormContainer from "../../Components/FormContainer";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useUploadUserProfileImageMutation,
} from "../../slices/usersApiSlice";
import Meta from "../../Components/Meta";

const UserEditScreen = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [canSendConstraints, setCanSendConstraints] = useState(false);
  const [canBeScheduled, setCanBeScheduled] = useState(false);

  const {
    data: user,
    error,
    refetch,
    isLoading,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const [uploadUserProfileImage, { isLoading: loadingUpload }] =
    useUploadUserProfileImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
      setImage(user.image);
      setCanSendConstraints(user.canSendConstraints);
      setCanBeScheduled(user.canBeScheduled);
    }
  }, [user]);

  const updateUserHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("עימות סיסמא נכשל - הסיסמאות לא זהות", {
        toastId: "toastError1",
      });
    } else {
      try {
        const res = await updateUser({
          userId,
          name,
          email,
          isAdmin,
          password,
          image,
        });
        if (res.error) throw res.error;
        toast.success("המשתמש עודכן בהצלחה", {
          toastId: "toastSuccess2",
        });
        refetch();
        navigate("/admin/userslist");
      } catch (err) {
        toast.error(err?.data?.message || err?.error || "שגיאה בעדכון משתמש", {
          toastId: "toastError2",
        });
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
      <Meta title={"עריכת משתמש | NOC Shift"} />
      <Link to="/admin/userslist" className="btn btn-light my-3">
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
            <Image
              src={image}
              roundedCircle={true}
              style={{ height: "100px", width: "100px" }}
            />
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
              <Form.Group
                controlId="isAdmin"
                className="my-3"
                style={{ paddingInlineEnd: "40rex" }}
              >
                <Form.Check
                  type="checkbox"
                  label="האם מנהל?"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
              </Form.Group>
              <Form.Group
                controlId="isAdmin"
                className="my-3"
                style={{ paddingInlineEnd: "27rex" }}
              >
                <Form.Check
                  type="checkbox"
                  label="האם יכול לשלוח אילוצים?"
                  checked={canSendConstraints}
                  onChange={(e) => setCanSendConstraints(e.target.checked)}
                ></Form.Check>
              </Form.Group>
              <Form.Group
                controlId="isAdmin"
                className="my-3"
                style={{ paddingInlineEnd: "18rex" }}
              >
                <Form.Check
                  type="checkbox"
                  label="האם יכול להשתבץ לסידור העבודה?"
                  checked={canBeScheduled}
                  onChange={(e) => setCanBeScheduled(e.target.checked)}
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
