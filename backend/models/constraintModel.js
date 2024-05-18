import mongoose from "mongoose";

const constraintSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekDates: {
      type: [Date], // Array of dates representing the week
      required: true,
    },
    weeklyConstraintArr: {
      type: [[Number]], // Array of arrays of numbers (0 or 1)
      required: true,
    },
    noteForAdmin: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    changeabilityExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Constraint = mongoose.model("Constraint", constraintSchema);

export default Constraint;
