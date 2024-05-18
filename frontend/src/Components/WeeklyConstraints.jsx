import { useEffect, useState } from "react";
import { useGetAllEmployeesWeeklyConstraintsQuery } from "../slices/constraintsApiSlice";
import { getNextWeekStart } from "../utils/nextWeekSunday";
import { Table, Row, Col, Card, Image, Container } from "react-bootstrap";
import { useGetUsersQuery } from "../slices/usersApiSlice";
import Loader from "./Loader";
import Message from "./Message";

const WeeklyConstraints = () => {
  const [nextSunday, setNextSunday] = useState(getNextWeekStart());

  const {
    data: constraints,
    isLoading: isLoadingConstraints,
    isError: isErrorConstraints,
    error: errorConstraints,
  } = useGetAllEmployeesWeeklyConstraintsQuery(nextSunday);

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useGetUsersQuery();

  useEffect(() => {
    // Update next Sunday whenever necessary
    //setNextSunday(getNextWeekStart());
  }, []);

  const findUserById = (id) => users?.find((user) => user._id === id);

  return (
    <Container>
      <h3>אילוצים של שבוע הבא</h3>
      {isLoadingConstraints || isLoadingUsers ? (
        <Loader />
      ) : isErrorConstraints ? (
        <Message variant="danger">{errorConstraints}</Message>
      ) : isErrorUsers ? (
        <Message variant="danger">{errorUsers}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>בקר</th>
              <th>תאריכים</th>
              <th>אילוצים לפי יום ומשמרת</th>
              <th>הערה מהבקר</th>
            </tr>
          </thead>
          <tbody>
            {constraints.map((constraint) => {
              const user = findUserById(constraint.employeeId);
              console.log(user);
              console.log(constraint);
              return (
                <tr key={constraint._id}>
                  <td>
                    {user && (
                      <Card>
                        <Card.Body>
                          <Row>
                            <Col md={4}>
                              <Image
                                src={user.image}
                                roundedCircle
                                width="50"
                              />
                            </Col>
                            <Col md={8}>
                              <Card.Title>{user.name}</Card.Title>
                              <Card.Text>{user.email}</Card.Text>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    )}
                  </td>
                  <td>
                    {constraint.weekDates.map((date, index) => (
                      <div key={index}>
                        {new Date(date).toLocaleDateString()}
                      </div>
                    ))}
                  </td>
                  <td>
                    {constraint.weeklyConstraintArr.map((shifts, index) => (
                      <div key={index}>
                        Day {index + 1}: {shifts.join(", ")}
                      </div>
                    ))}
                  </td>
                  <td>{constraint.noteForAdmin}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default WeeklyConstraints;
