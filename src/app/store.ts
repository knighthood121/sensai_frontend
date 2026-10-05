import { configureStore } from '@reduxjs/toolkit';
import { api } from '../service/api';
import authReducer from '../Feature/Authentication/Slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Turn off serializable check if necessary for file upload payloads
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
