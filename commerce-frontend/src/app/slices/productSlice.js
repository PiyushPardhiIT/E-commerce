import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllProductsApi,
  getProductByIdApi,
  searchProductsApi,
  getAllCategoriesApi,
} from '../../api/productApi';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllProductsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await getProductByIdApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async (params, { rejectWithValue }) => {
    try {
      const res = await searchProductsApi(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllCategoriesApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;