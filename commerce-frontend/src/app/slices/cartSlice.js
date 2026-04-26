import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
} from '../../api/cartApi';

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCartApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/add',
  async (data, { rejectWithValue }) => {
    try {
      const res = await addToCartApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await updateCartItemApi(cartItemId, { quantity });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const res = await removeFromCartApi(cartItemId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await clearCartApi();
      return { items: [], totalItems: 0, totalAmount: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading = false;
      state.items = action.payload.items || [];
      state.totalItems = action.payload.totalItems || 0;
      state.totalAmount = action.payload.totalAmount || 0;
    };

    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(clearCart.fulfilled, setCart);
  },
});

export default cartSlice.reducer;