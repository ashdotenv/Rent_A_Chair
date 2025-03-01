import { configureStore } from "@reduxjs/toolkit";
import { serviceApi } from "./Service";
import serviceSlice from "./slice";
export const store = configureStore({
  reducer: {
    service: serviceSlice,
    [serviceApi.reducerPath]: serviceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      serviceApi.middleware
    ),
});
