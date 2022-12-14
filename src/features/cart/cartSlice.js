import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client.js";
import { clearAuthentication } from "../auth/authSlice.js"

const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { dispatch, rejectWithValue }) => {
    const response = await client.get("/cart");
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

const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (payload, { dispatch, rejectWithValue }) => {
    const response = await client.post("/cart", payload);
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

const updateItemInCart = createAsyncThunk(
  "cart/updateItem",
  async ({ cartItemId, payload }, { dispatch, rejectWithValue }) => {
    const response = await client.put(`/cart/${cartItemId}`, payload);
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

const deleteItemInCart = createAsyncThunk(
  "cart/deleteItem",
  async (cartItemId, { dispatch, rejectWithValue }) => {
    const response = await client.delete(`/cart/${cartItemId}`);
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

const initialState = {
  status: "idle",
  cart: null,
  error: null,
  shouldRefresh: false
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.status = "loading";
        state.cart = null;
        state.error = null;
        state.shouldRefresh = false;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        state.error = null;
        state.shouldRefresh = false;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.status = "failed";
        state.cart = null;
        state.error = action.payload;
        state.shouldRefresh = false;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.shouldRefresh = true;
      })
      .addCase(updateItemInCart.fulfilled, (state) => {
        state.shouldRefresh = true;
      })
      .addCase(deleteItemInCart.fulfilled, (state) => {
        state.shouldRefresh = true;
      })
      .addCase("orders/createOrder/fulfilled", (state) => {
        state.shouldRefresh = true;
      })
      .addCase("auth/logout/fulfilled", (state) => {
        state.status = "idle";
        state.cart = null;
        state.error = null;
        state.shouldRefresh = false;
      })
      .addCase("customer/deleteCustomer/fulfilled", (state) => {
        state.status = "idle";
        state.cart = null;
        state.error = null;
        state.shouldRefresh = false;
      })
  }
});

export default cartSlice.reducer;

export { getCart, addItemToCart, updateItemInCart, deleteItemInCart };