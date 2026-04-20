import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chat";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});
