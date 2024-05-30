import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetWeeklyConstraintQuery,
  useUpdateConstraintMutation,
} from "../slices/constraintsApiSlice";
import { getNextWeekStart } from "../utils/nextWeekSunday";
import { Table, Card, Container, Button } from "react-bootstrap";
import { FaTimes, FaCheck } from "react-icons/fa";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import Loader from "../Components/Loader";
import Message from "../Components/Message";
import { toast } from "react-toastify";

const ConstraintSubmissionScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const createdAtDate = new Date(userInfo.createdAt);
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const createdDateMinusOneWeek = new Date(
    createdAtDate.getTime() - oneWeekInMilliseconds
  );
  const sundayOfRegistrationWeek = new Date(
    getNextWeekStart(createdDateMinusOneWeek)
  ).toLocaleDateString();

  const initialSunday = getNextWeekStart();
  const [sunday, setSunday] = useState(initialSunday);

  const [sundayHeaderDate, setSundayHeaderDate] = useState(
    new Date(initialSunday)
  );
  const [saturdayHeaderDate, setSaturdayHeaderDate] = useState(
    new Date(initialSunday).setDate(new Date(initialSunday).getDate() + 6)
  );

  const [disablePreviousWeekButton, setDisablePreviousWeekButton] =
    useState(false);

  const { data, isLoading, isError, error, refetch } =
    useGetWeeklyConstraintQuery(sunday);

  const [updateConstraint, { isLoading: loadingUpdateConstraint }] =
    useUpdateConstraintMutation();

  const [constraintsArr, setConstraintsArr] = useState([]);
  const [noteToAdmin, setNoteToAdmin] = useState([]);

  useEffect(() => {
    refetch();
  }, [sunday, refetch]);

  useEffect(() => {
    if (sundayHeaderDate.toLocaleDateString() !== sundayOfRegistrationWeek) {
      setDisablePreviousWeekButton(false);
    }
    if (data) {
      setConstraintsArr(data.weeklyConstraintArr);
      setNoteToAdmin(data.noteForAdmin);
    }
  }, [data, sundayHeaderDate, sundayOfRegistrationWeek]);

  const previousWeekHandler = () => {
    setDisablePreviousWeekButton(true);

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

  const toggleConstraint = (dayIndex, shiftIndex) => {
    const newConstraints = constraintsArr.map((day, index) => {
      if (index === dayIndex) {
        return day.map((shift, i) => {
          if (i === shiftIndex) {
            return shift === 0 ? 1 : 0;
          }
          return shift;
        });
      }
      return day;
    });
    setConstraintsArr(newConstraints);
  };

  const handleSubmit = async () => {
    if (window.confirm("האם אתה בטוח שברצונך לשמור את השינויים?")) {
      try {
        await updateConstraint({
          id: data._id,
          data: {
            weeklyConstraintArr: constraintsArr,
            noteForAdmin: noteToAdmin,
          },
        });
        toast.success("האילוצים נשמרו בהצלחה", { toastId: "toastSuccess1" });
        refetch();
      } catch (err) {
        toast.error(
          err?.data?.message || err?.error || "שגיאה בעדכון אילוצים",
          {
            toastId: "toastError1",
          }
        );
      }
    }
  };

  return (
    <Container>
      {sunday === initialSunday ? (
        <div className="weeksPaging">
          <Button
            title="שבוע קודם"
            disabled={disablePreviousWeekButton}
            style={{ padding: "3px" }}
            onClick={previousWeekHandler}
          >
            <FaAnglesRight
              style={{ width: "25px", strokeWidth: "5px", height: "25px" }}
            />
          </Button>
          <h3 className="mb-1 mx-2">אילוצים להגשה עבור שבוע הבא</h3>
        </div>
      ) : (
        <div className="weeksPaging">
          {isLoading ? (
            <Loader />
          ) : sundayHeaderDate.toLocaleDateString() ===
            sundayOfRegistrationWeek ? (
            <h3 className="mb-1 mx-2">
              {sundayHeaderDate.toLocaleDateString() +
                " - " +
                saturdayHeaderDate.toLocaleDateString()}
            </h3>
          ) : (
            <>
              <Button
                title="שבוע קודם"
                disabled={disablePreviousWeekButton}
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
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">{error}</Message>
      ) : !data ? (
        <Message variant="danger">אין אילוצים להצגה עבור תאריכים אלו</Message>
      ) : (
        <>
          {data.changeabilityExpired && sunday === initialSunday && (
            <div style={{ width: "430px" }}>
              <Message>
                הגשת אילוצים לעוד שבועיים תתאפשר ביום ראשון בבוקר
              </Message>
            </div>
          )}
          {!data.changeabilityExpired && sunday === initialSunday && (
            <div style={{ width: "520px" }}>
              {data.isExtended ? (
                <Message>
                  ניתן לשנות את האילוצים עד יום רביעי בלילה לאחר הארכה מהמנהל
                </Message>
              ) : (
                <Message>ניתן לשנות את האילוצים עד יום שלישי בלילה</Message>
              )}
            </div>
          )}
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>משמרת</th>
                <th>אילוצים של השבוע</th>
              </tr>
            </thead>
            <tbody>
              <tr>
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
                          {constraintsArr.map((shifts, dayIndex) => (
                            <td
                              style={{
                                width: "14.28%",
                                minWidth: "54.77px",
                              }}
                              key={dayIndex}
                            >
                              {shifts[shiftIndex] !== undefined ? (
                                <Button
                                  className="FaCheckAndTimes"
                                  disabled={data.changeabilityExpired}
                                  onClick={() =>
                                    toggleConstraint(dayIndex, shiftIndex)
                                  }
                                >
                                  {shifts[shiftIndex] === 0 ? (
                                    <FaCheck style={{ color: "green" }} />
                                  ) : shifts[shiftIndex] === 1 ? (
                                    <FaTimes
                                      style={{
                                        color: "red",
                                      }}
                                    />
                                  ) : (
                                    <div className="FaCheckAndTimes">-</div>
                                  )}
                                </Button>
                              ) : (
                                <div className="FaCheckAndTimes">-</div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
              </tr>
            </tbody>
          </Table>
          <Card className="my-3" style={{ maxWidth: "400px", height: "180px" }}>
            <Card.Body>
              <Card.Title>הערה למנהל</Card.Title>
              <Card.Text style={{ height: "75%" }}>
                <textarea
                  maxlength="120"
                  style={{ width: "100%", height: "100%", resize: "none" }}
                  placeholder={
                    data.changeabilityExpired
                      ? `לא הכנסו הערות למנהל`
                      : `הכנס הערות נוספות כאן... (עד 120 תווים)`
                  }
                  value={noteToAdmin}
                  readOnly={data.changeabilityExpired}
                  onChange={(e) => setNoteToAdmin(e.target.value)}
                ></textarea>
              </Card.Text>
            </Card.Body>
          </Card>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loadingUpdateConstraint || data.changeabilityExpired}
          >
            {loadingUpdateConstraint ? "מעדכן..." : "הגש אילוצים"}
          </Button>
          {loadingUpdateConstraint && <Loader />}
          {data.changeabilityExpired && sunday === initialSunday && (
            <div style={{ marginTop: "15px", width: "220px" }}>
              <Message variant="danger">תם מועד הגשת האילוצים</Message>
            </div>
          )}
        </>
      )}
    </Container>
  );
};
export default ConstraintSubmissionScreen;
