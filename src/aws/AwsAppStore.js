import { createStore as reduxCreateStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import awsAppReducer from "./AwsAppModule";
import rootSaga from "./AwsAppSaga";

export default function createStore() {
  console.log("AwsAppModule.createStore()");
  const sagaMiddleware = createSagaMiddleware();
  const store = reduxCreateStore(
    awsAppReducer,
    applyMiddleware(sagaMiddleware, logger)
  );
  sagaMiddleware.run(rootSaga);

  return store;
}
