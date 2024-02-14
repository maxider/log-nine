import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";
import teamReducer from "./teamSlice";

export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        teams: teamReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;