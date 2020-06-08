import { createStore as reduxCreateStore, applyMiddleware,combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import tenant from "./TenantAppModule";
import list from "./ListModule";
import addNew from "./AddNewModule";
import env from "./EnvironmentModule";
import rootSaga from "../saga/TenantAppSaga";

export default function createStore() {
  const sagaMiddleware = createSagaMiddleware();
  const store = reduxCreateStore(
      combineReducers({
            tenant,
            list,
            addNew,
            env,
        }
      ),
    applyMiddleware(sagaMiddleware, logger)
  );
  sagaMiddleware.run(rootSaga);

  return store;
}
