import { useSelector } from "react-redux";
import Message from "../Components/Message";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      {!userInfo.isActive ? (
        <Message>אנא בקש ממנהל הבקרה לאשר אותך</Message>
      ) : (
        <div>סידור עבודה</div>
      )}
    </>
  );
};
export default HomeScreen;
