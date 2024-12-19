// src/redux/features/companiesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5001/api/companies";

// Thunks
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const addCompany = createAsyncThunk(
  "companies/addCompany",
  async (company) => {
    const response = await axios.post(API_URL, company);
    return response.data;
  }
);

export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ id, company }) => {
    const response = await axios.put(`${API_URL}/${id}`, company);
    return response.data;
  }
);

export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

// Slice
const companiesSlice = createSlice({
  name: "companies",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch companies
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add company
      .addCase(addCompany.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update company
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (company) => company._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete company
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (company) => company._id !== action.payload
        );
      });
  },
});

export default companiesSlice.reducer;
