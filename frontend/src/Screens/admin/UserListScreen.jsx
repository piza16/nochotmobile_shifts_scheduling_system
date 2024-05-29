import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Card, Image } from "react-bootstrap";
import { FcApprove } from "react-icons/fc";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import Meta from "../../Components/Meta";

const UserListScreen = () => {
  const { data: users, refetch, error, isLoading } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("המשתמש נמחק", {
          toastId: "toastSuccess2",
        });
      } catch (err) {
        toast.error(err?.data?.message || err?.error || "שגיאה במחיקת משתמש", {
          toastId: "toastError2",
        });
      }
    }
  };

  const approveUserHandler = async (userId) => {
    if (window.confirm("האם אתה בטוח שברצונך לאשר משתמש זה?")) {
      try {
        await updateUser({ userId, isActive: true });
        refetch();
        toast.success("המשתמש אושר בהצלחה", {
          toastId: "toastSuccess1",
        });
      } catch (err) {
        toast.error(err?.data?.message || err?.error || "שגיאה באישור המשתמש", {
          toastId: "toastError1",
        });
      }
    }
  };

  return (
    <>
      <Meta title={"כל המשתמשים | NOC Shift"} />
      <h1>משתמשים</h1>
      {loadingDelete && <Loader />}
      {loadingUpdate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>תמונת פרופיל</th>
                <th>שם</th>
                <th>דוא"ל</th>
                <th>מנהל</th>
                <th>פעיל</th>
                <th title="במידה ויסומן כלא פעיל - לעובד מרגע זה אין יותר גישה לעמוד הגשת האילוצים ובין יום שבת הקרוב ליום ראשון ב12 בלילה לא יווצר לעובד לוח הגשת אילוצים לשבוע שלאחריו.">
                  יכול להגיש אילוצים
                  <span style={{ color: "red", fontWeight: "bolder" }}>*</span>
                </th>
                <th>יכול להשתבץ לסידור</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {" "}
                    <Image
                      src={user.image}
                      roundedCircle={true}
                      style={{ height: "70px", width: "70px" }}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {user.isActive ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {user.canSendConstraints ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {user.canBeScheduled ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {!user.isActive && (
                      <Button
                        style={{ padding: 0 }}
                        variant="danger"
                        title="אישור משתמש"
                        className="btn-sm"
                        onClick={() => approveUserHandler(user._id)}
                      >
                        <FcApprove style={{ width: "40px", height: "40px" }} />
                      </Button>
                    )}
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button
                        title="עריכת משתמש"
                        variant="light"
                        className="btn-sm"
                      >
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      title="מחיקת משתמש"
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
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

export default UserListScreen;
