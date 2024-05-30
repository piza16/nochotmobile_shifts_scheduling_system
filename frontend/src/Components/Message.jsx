import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  return (
    <Alert
      style={{ paddingTop: "10px", paddingBottom: "10px" }}
      variant={variant}
    >
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: "info",
};

export default Message;
