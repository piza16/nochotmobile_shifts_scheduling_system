import { useEffect, useState } from "react";
import { useGetAllEmployeesWeeklyConstraintsQuery } from "../slices/constraintsApiSlice";
import { getNextWeekStart } from "../utils/nextWeekSunday";
import { Table, Row, Col, Card, Image, Container } from "react-bootstrap";
import { useGetUsersQuery } from "../slices/usersApiSlice";
import { FaTimes, FaCheck } from "react-icons/fa";
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
              <th>משמרת</th>
              <th>אילוצים של השבוע</th>
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
                  <td style={{ width: "20%" }}>
                    {user && (
                      <Card style={{ minWidth: "320px" }}>
                        <Card.Body>
                          <Row>
                            <Col md={4}>
                              <Image
                                src={user.image}
                                roundedCircle
                                width="80px"
                              />
                            </Col>
                            <Col md={8} className="d-flex align-items-center">
                              <Card.Title>{user.name}</Card.Title>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    )}
                  </td>
                  <td>
                    <div
                      className="table-cell-flex"
                      style={{ fontWeight: "bold" }}
                    >
                      <span></span>
                      <div>בוקר</div>
                      <div>ערב</div>
                      <div>לילה</div>
                    </div>
                  </td>
                  <td>
                    <Table
                      striped
                      bordered
                      hover
                      responsive
                      className="table-sm my-0"
                    >
                      <thead>
                        <tr>
                          <th>ראשון</th>
                          <th>שני</th>
                          <th>שלישי</th>
                          <th>רביעי</th>
                          <th>חמישי</th>
                          <th>שישי</th>
                          <th>שבת</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[0, 1, 2].map((shiftIndex) => (
                          <tr style={{ height: "47.84px" }} key={shiftIndex}>
                            {constraint.weeklyConstraintArr.map(
                              (shifts, dayIndex) => (
                                <td
                                  style={{
                                    width: "14.28%",
                                    minWidth: "54.77px",
                                  }}
                                  key={dayIndex}
                                >
                                  {shifts[shiftIndex] !== undefined ? (
                                    shifts[shiftIndex] === 0 ? (
                                      <div className="FaCheckAndTimes">
                                        <FaCheck style={{ color: "green" }} />
                                      </div>
                                    ) : shifts[shiftIndex] === 1 ? (
                                      <div className="FaCheckAndTimes">
                                        <FaTimes
                                          style={{
                                            color: "red",
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <div className="FaCheckAndTimes">-</div>
                                    )
                                  ) : (
                                    <div className="FaCheckAndTimes">-</div> // Placeholder if no shift value exists
                                  )}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </td>
                  <td style={{ width: "20%" }}>
                    {constraint.noteForAdmin && (
                      <Card style={{ minWidth: "160px" }}>
                        <Card.Body style={{ padding: "1px" }}>
                          {constraint.noteForAdmin}
                        </Card.Body>
                      </Card>
                    )}
                  </td>
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

// <tr>
// {constraint.weeklyConstraintArr.map(
//   (shifts, dayIndex) => (
//     <td key={dayIndex}>
//       {shifts.map((shiftVal, shiftIndex) => {
//         if (shiftIndex === 0) {
//           return (
//             <div key={shiftIndex}>{shiftVal}</div>
//           );
//         }
//       })}
//     </td>
//   )
// )}
// </tr>
