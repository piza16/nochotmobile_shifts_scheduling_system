import { useSelector } from "react-redux";
import Message from "../../Components/Message";
import WeeklyConstraints from "../../Components/WeeklyConstraints";

const AdminHomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      {!userInfo.isActive ? (
        <Message>אנא בקש ממנהל הבקרה לאשר אותך</Message>
      ) : (
        <WeeklyConstraints />
      )}
    </>
  );
};
export default AdminHomeScreen;
