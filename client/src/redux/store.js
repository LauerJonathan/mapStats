import { configureStore } from "@reduxjs/toolkit";
import companiesReducer from "./features/companiesSlice";

export const store = configureStore({
  reducer: {
    companies: companiesReducer,
  },
});
