import cron from "node-cron";
import { createNextWeekConstraints } from "./controllers/constraintController.js";

const scheduleJobs = () => {
  // Schedule the cron job to run at Sunday 00:00
  cron.schedule(
    "0 0 * * 0",
    async () => {
      await createNextWeekConstraints();
    },
    {
      scheduled: true,
      timezone: "Asia/Jerusalem",
    }
  );
};

export default scheduleJobs;
