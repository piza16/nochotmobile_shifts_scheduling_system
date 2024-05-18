import { useEffect } from "react";
import { useSelector } from "react-redux";
import Message from "../Components/Message";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [userInfo, navigate]);

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
