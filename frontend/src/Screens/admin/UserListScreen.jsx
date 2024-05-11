import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Card } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import Meta from "../../Components/Meta";

const UserListScreen = () => {
  const { data: users, refetch, error, isLoading } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("המשתמש נמחק", {
          toastId: "toastSuccess1",
        });
      } catch (err) {
        toast.error(err?.data?.message || err?.error || "שגיאה במחיקת משתמש", {
          toastId: "toastError1",
        });
      }
    }
  };

  return (
    <>
      <Meta title={"רשימת כל המשתמשים | Jobify"} />
      <h1>משתמשים</h1>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Card>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>מזהה משתמש</th>
                <th>שם</th>
                <th>דוא"ל</th>
                <th>מנהל</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
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
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
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
