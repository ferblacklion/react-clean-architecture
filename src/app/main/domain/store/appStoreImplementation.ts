import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import { counterReducer } from "../../../counter/domain/store/counterReducer";

const rootReducer = combineReducers({
  counter: counterReducer,
});

const appStoreImplementation = createStore(rootReducer, applyMiddleware(thunk));

type AppRootState = ReturnType<typeof appStoreImplementation.getState>;

export { appStoreImplementation };
export type { AppRootState };
