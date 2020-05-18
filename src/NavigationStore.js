import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import history from "./asset/history";
import { createLogger } from "redux-logger";
import { routerMiddleware, connectRouter } from "connected-react-router";
import navigationReducer from "./NavigationModule";

const routeMiddleware = routerMiddleware(history);

const middlewares = [routeMiddleware, createLogger()];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  return createStore(
    combineReducers({
      router: connectRouter(history),
      navigationReducer,
    }),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  //    sagaMiddleware.run(rootSaga);
}
export { history };
