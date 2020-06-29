import { combineReducers } from "redux";
import list from "./ListModule"
import add from "./AddModule"
import profile from "./ProfileModule"
import ui from "./UiModule"

export const CHANGE_PROPERTY_ADD    = "CHANGE_PROPERTY_ADD";
export const CHANGE_PROPERTY_UPDATE = "CHANGE_PROPERTY_UPDATE";
export const INIT_ADD               = "INIT_ADD";
export const ON_SUCCESS_INIT_ADD    = "ON_SUCCESS_INIT_ADD";
export const GET_ES_LIST            = "GET_ES_LIST"
export const INIT_PROFILE           = "INIT_PROFILE";
export const ON_SUCCESS_INIT_PROFILE = "ON_SUCCESS_INIT_PROFILE";
export const GET_BY_ID              = "GET_BY_ID";
export const ON_SUCCESS_GET_BY_ID   = "ON_SUCCESS_GET_BY_ID";
export const ADD_CHILD              = "ADD_CHILD";
export const MOD_CHILD              = "MOD_CHILD";
export const DEL_CHILD              = "DEL_CHILD";

export default combineReducers({
    list,
    add,
    profile,
    ui,
});
