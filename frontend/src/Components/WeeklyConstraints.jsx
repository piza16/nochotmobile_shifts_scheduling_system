import { useEffect, useState } from "react";
import { useGetAllEmployeesWeeklyConstraintsQuery } from "../slices/constraintsApiSlice";
import { getNextWeekStart } from "../utils/nextWeekSunday";
import {
  Table,
  Row,
  Col,
  Card,
  Image,
  Container,
  Button,
} from "react-bootstrap";
import { useGetUsersQuery } from "../slices/usersApiSlice";
import { FaTimes, FaCheck } from "react-icons/fa";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import Loader from "./Loader";
import Message from "./Message";

const WeeklyConstraints = () => {
  const initialSunday = getNextWeekStart();
  const [sunday, setSunday] = useState(initialSunday);

  const [sundayHeaderDate, setSundayHeaderDate] = useState(
    new Date(initialSunday)
  );
  const [saturdayHeaderDate, setSaturdayHeaderDate] = useState(
    new Date(initialSunday).setDate(new Date(initialSunday).getDate() + 6)
  );

  const {
    data: constraints,
    isLoading: isLoadingConstraints,
    isError: isErrorConstraints,
    error: errorConstraints,
    refetch: refetchConstraints,
  } = useGetAllEmployeesWeeklyConstraintsQuery(sunday);

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useGetUsersQuery();

  useEffect(() => {
    refetchConstraints();
  }, [sunday, refetchConstraints]);

  const previousWeekHandler = () => {
    const newSundayHeaderDate = new Date(sundayHeaderDate);
    newSundayHeaderDate.setDate(newSundayHeaderDate.getDate() - 7);
    setSundayHeaderDate(newSundayHeaderDate);

    const newSaturdayHeaderDate = new Date(saturdayHeaderDate);
    newSaturdayHeaderDate.setDate(newSaturdayHeaderDate.getDate() - 7);
    setSaturdayHeaderDate(newSaturdayHeaderDate);

    const currentDate = new Date(sunday);
    const previousSunday = new Date(currentDate);
    previousSunday.setDate(currentDate.getDate() - 7);
    setSunday(previousSunday.toISOString());
  };

  const nextWeekHandler = () => {
    const newSundayHeaderDate = new Date(sundayHeaderDate);
    newSundayHeaderDate.setDate(newSundayHeaderDate.getDate() + 7);
    setSundayHeaderDate(newSundayHeaderDate);

    const newSaturdayHeaderDate = new Date(saturdayHeaderDate);
    newSaturdayHeaderDate.setDate(newSaturdayHeaderDate.getDate() + 7);
    setSaturdayHeaderDate(newSaturdayHeaderDate);

    const currentDate = new Date(sunday);
    const previousSunday = new Date(currentDate);
    previousSunday.setDate(currentDate.getDate() + 7);
    setSunday(previousSunday.toISOString());
  };

  const findUserById = (id) => users?.find((user) => user._id === id);

  return (
    <Container>
      {sunday === initialSunday ? (
        <div className="weeksPaging">
          <Button
            title="שבוע קודם"
            style={{ padding: "3px" }}
            onClick={previousWeekHandler}
          >
            <FaAnglesRight
              style={{ width: "25px", strokeWidth: "5px", height: "25px" }}
            />
          </Button>
          <h3 className="mb-1 mx-2">אילוצים של שבוע הבא</h3>
        </div>
      ) : (
        <div className="weeksPaging">
          {isLoadingConstraints ? (
            <Loader />
          ) : !constraints || constraints.length === 0 ? (
            <h3 className="mb-1 mx-2">
              {sundayHeaderDate.toLocaleDateString() +
                " - " +
                saturdayHeaderDate.toLocaleDateString()}
            </h3>
          ) : (
            <>
              <Button
                title="שבוע קודם"
                style={{ padding: "3px" }}
                onClick={previousWeekHandler}
              >
                <FaAnglesRight
                  style={{ width: "25px", strokeWidth: "5px", height: "25px" }}
                />
              </Button>

              <h3 className="mb-1 mx-2">
                {sundayHeaderDate.toLocaleDateString() +
                  " - " +
                  saturdayHeaderDate.toLocaleDateString()}
              </h3>
            </>
          )}
          <Button
            title="שבוע הבא"
            style={{ padding: "3px" }}
            onClick={nextWeekHandler}
          >
            <FaAnglesLeft
              style={{ width: "25px", strokeWidth: "5px", height: "25px" }}
            />
          </Button>
        </div>
      )}
      {isLoadingConstraints || isLoadingUsers ? (
        <Loader />
      ) : isErrorConstraints ? (
        <Message variant="danger">{errorConstraints}</Message>
      ) : isErrorUsers ? (
        <Message variant="danger">{errorUsers}</Message>
      ) : !constraints || constraints.length === 0 ? (
        <Message variant="danger">אין אילוצים להצגה עבור תאריכים אלו</Message>
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
