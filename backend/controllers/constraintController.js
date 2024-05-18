import asyncHandler from "../middleware/asyncHandler.js";
import Constraint from "../models/constraintModel.js";
import User from "../models/userModel.js";
import { getNextWeekDates } from "../utils/nextWeekDates.js";

// @desc    Get weekly constraint for the authenticated user
// @route   GET /api/constraints
// @access  Private
const getEmployeeWeeklyConstraint = asyncHandler(async (req, res) => {
  const { firstDayOfWeekDate } = req.query; // Expecting the date to be passed as a query parameter

  const constraint = await Constraint.findOne({
    employeeId: req.user._id,
    weekDates: { $elemMatch: { $eq: new Date(firstDayOfWeekDate) } },
  });

  res.status(200).json(constraint);
});

// @desc    Get weekly constraints of all users
// @route   GET /api/constraints/all
// @access  Admin
const getAllEmployeesWeeklyConstraint = asyncHandler(async (req, res) => {
  const { firstDayOfWeekDate } = req.query; // Expecting the date to be passed as a query parameter
  console.log(firstDayOfWeekDate);
  const firstDay = new Date(firstDayOfWeekDate);
  firstDay.setHours(0, 0, 0, 0); // Reset to midnight to match only the date part
  const constraints = await Constraint.find({
    weekDates: {
      $elemMatch: {
        $gte: firstDay,
        $lt: new Date(firstDay.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });
  console.log(constraints);
  res.status(200).json(constraints);
});

// @desc    Create new weekly constraints for all users with canSendConstraints=true
// @route   No Route
// @access  Time entity once a week on Sunday at 00:00
const createNextWeekConstraints = async () => {
  try {
    const users = await User.find({ canSendConstraints: true });

    const weekDates = getNextWeekDates(); // util function calculate this (array of 7 dates representing the next week)
    const weeklyConstraintArr = Array(7).fill([0, 0, 0]); // Default empty constraints
    const noteForAdmin = ""; // Default empty note

    for (const user of users) {
      const constraint = new Constraint({
        employeeId: user._id,
        weekDates,
        weeklyConstraintArr,
        noteForAdmin,
      });

      await constraint.save();
    }
    console.log("Weekly constraints created for all eligible users");
  } catch (error) {
    console.error("Error creating weekly constraints:", error);
  }
};

// @desc    Update constraints
// @route   PUT /api/constraints/:id
// @access  Private
const updateConstraint = asyncHandler(async (req, res) => {
  const constraint = await Constraint.findById(req.params.id);

  if (constraint && !constraint.changeabilityExpired) {
    if (constraint.employeeId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("אין הרשאה לבצע פעולה זו");
    }
    constraint.weekDates = req.body.weekDates || constraint.weekDates;
    constraint.weeklyConstraintArr =
      req.body.weeklyConstraintArr || constraint.weeklyConstraintArr;
    constraint.noteForAdmin = req.body.noteForAdmin || constraint.noteForAdmin;
    constraint.isPublished = req.body.isPublished || constraint.isPublished;

    const updatedConstraint = await constraint.save();
    res.status(200).json(updatedConstraint);
  } else {
    res.status(404);
    throw new Error("אילוץ לא נמצא או שהזמן לשינוי פג");
  }
});

export {
  getEmployeeWeeklyConstraint,
  getAllEmployeesWeeklyConstraint,
  createNextWeekConstraints,
  updateConstraint,
};
