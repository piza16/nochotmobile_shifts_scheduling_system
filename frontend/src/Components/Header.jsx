import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../Assets/logo.png";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <Navbar
        className="py-3 px-1"
        bg="dark"
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src={logo}
                alt="NOC shifts"
                style={{ width: "160px", height: "90px" }}
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {userInfo && (
                <Nav.Item>
                  <Image
                    className="my-2"
                    src={userInfo.image}
                    roundedCircle={true}
                    style={{ height: "55px", width: "55px" }}
                  />
                </Nav.Item>
              )}
              <Nav.Item>
                {userInfo ? (
                  <NavDropdown title={`שלום ${userInfo.name}`} id="username">
                    {userInfo.canSendConstraints && (
                      <LinkContainer to="constraints">
                        <NavDropdown.Item>הגשת אילוצים</NavDropdown.Item>
                      </LinkContainer>
                    )}
                    <LinkContainer to="profile">
                      <NavDropdown.Item>פרופיל</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      יציאה
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaUser />
                      &nbsp;כניסת משתמש
                    </Nav.Link>
                  </LinkContainer>
                )}
              </Nav.Item>
              {userInfo && userInfo.isAdmin && (
                <Nav.Item>
                  <NavDropdown title="ניהול" id="adminmenu">
                    <LinkContainer to="/admin/userslist">
                      <NavDropdown.Item>משתמשים</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                </Nav.Item>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
