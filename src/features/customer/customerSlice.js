import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client.js";
import { clearAuthentication } from "../auth/authSlice.js";

const getCustomerInfo = createAsyncThunk(
  "customer/getInfo",
  async (_, { dispatch, rejectWithValue }) => {
    const response = await client.get("/customer");
    if (response.error) {
      if (response.status === 401) {
        dispatch(clearAuthentication());
        localStorage.setItem("lastLogin", "");
      }
      return rejectWithValue(response.data);
    }
    return response.data;
  }
);

const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (payload, { rejectWithValue }) => {
    const response = await client.post("/customer", payload);
    if (response.error) {
      return rejectWithValue(response.data);
    }
    return response.data;
  }
);

const updateCustomerInfo = createAsyncThunk(
  "customer/updateInfo",
  async (payload, { dispatch, rejectWithValue }) => {
    const response = await client.put("/customer", payload);
    if (response.error) {
      if (response.status === 401) {
        dispatch(clearAuthentication());
        localStorage.setItem("lastLogin", "");
      }
      return rejectWithValue(response.data);
    }
    return response.data;
  }
);

const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (_, { dispatch, rejectWithValue }) => {
    const response = await client.delete("/customer");
    if (response.error) {
      if (response.status === 401) {
        dispatch(clearAuthentication());
        localStorage.setItem("lastLogin", "");
      }
      return rejectWithValue(response.data);
    }
    localStorage.setItem("lastLogin", "");
    return response.data;
  }
);

const initialState = {
  status: "idle",
  customer: null,
  error: null,
  shouldRefresh: false
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerInfo.pending, (state) => {
        state.status = "loading";
        state.customer = null;
        state.error = null;
        state.shouldRefresh = false;
      })
      .addCase(getCustomerInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customer = action.payload;
        state.error = null;
        state.shouldRefresh = false;
      })
      .addCase(getCustomerInfo.rejected, (state, action) => {
        state.status = "failed";
        state.customer = null;
        state.error = action.payload;
        state.shouldRefresh = false;
      })
      .addCase(updateCustomerInfo.fulfilled, (state) => {
        state.shouldRefresh = true;
      })
      .addCase(deleteCustomer.fulfilled, (state) => {
        state.status = "idle";
        state.customer = null;
        state.error = null;
        state.shouldRefresh = false;
      })
      .addCase("auth/logout/fulfilled", (state) => {
        state.status = "idle";
        state.customer = null;
        state.error = null;
        state.shouldRefresh = false;
      })
  }
});

export default customerSlice.reducer;

export { getCustomerInfo,
         createCustomer,
         updateCustomerInfo, 
         deleteCustomer };