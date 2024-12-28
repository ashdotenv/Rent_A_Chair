import { configureStore } from "@reduxjs/toolkit";
import serviceSlice from "./Service/slice";
import { serviceApi } from "./Service/Service";
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
