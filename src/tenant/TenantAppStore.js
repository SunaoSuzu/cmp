import { createStore as reduxCreateStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import tenantAppReducer from "./TenantAppModule";
import rootSaga from "./TenantAppSaga";

export default function createStore() {
  console.log("TenantAppStore.createStore()");
  const sagaMiddleware = createSagaMiddleware();
  const store = reduxCreateStore(
    tenantAppReducer,
    applyMiddleware(sagaMiddleware, logger)
  );
  sagaMiddleware.run(rootSaga);

  return store;
}
