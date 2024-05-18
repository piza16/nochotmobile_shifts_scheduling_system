import { apiSlice } from "./apiSlice";
import { CONSTRAINTS_URL } from "../constants";

const constraintsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint to get all weekly constraints for all users (admin)
    getAllEmployeesWeeklyConstraints: builder.query({
      query: (firstDayOfWeekDate) => ({
        url: `${CONSTRAINTS_URL}/all`,
        params: { firstDayOfWeekDate },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Constraints"],
    }),

    // Endpoint to get weekly constraint for the authenticated user
    getWeeklyConstraint: builder.query({
      query: (firstDayOfWeekDate) => ({
        url: `${CONSTRAINTS_URL}`,
        params: { firstDayOfWeekDate },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Constraints"],
    }),

    // Endpoint to update an existing constraint by user
    updateConstraint: builder.mutation({
      query: ({ id, data }) => ({
        url: `${CONSTRAINTS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllEmployeesWeeklyConstraintsQuery,
  useGetWeeklyConstraintQuery,
  useUpdateConstraintMutation,
} = constraintsApiSlice;
