import { combineReducers } from "redux";
import list from "./ListModule"
import add from "./AddModule"
import profile from "./ProfileModule"
import ui from "./UiModule"
import listMod from "./ListModifyModule"

export const CHANGE_PROPERTY_ADD    = "CHANGE_PROPERTY_ADD";
export const CHANGE_PROPERTY_UPDATE = "CHANGE_PROPERTY_UPDATE";
export const INIT_ADD               = "INIT_ADD";
export const ON_SUCCESS_INIT_ADD    = "ON_SUCCESS_INIT_ADD";
export const ADD                    = "ADD";
export const ON_SUCCESS_ADD         = "ON_SUCCESS_ADD";
export const GET_LIST               = "GET_LIST"
export const ON_SUCCESS_GET_LIST    = "ON_SUCCESS_GET_LIST"
export const GET_ES_LIST            = "GET_ES_LIST"
export const ON_SUCCESS_GET_ES_LIST = "ON_SUCCESS_GET_ES_LIST"
export const ON_SUCCESS_SEARCH_ES_LIST = "ON_SUCCESS_SEARCH_ES_LIST"
export const INIT_PROFILE           = "INIT_PROFILE";
export const ON_SUCCESS_INIT_PROFILE = "ON_SUCCESS_INIT_PROFILE";
export const GET_BY_ID              = "GET_BY_ID";
export const ON_SUCCESS_GET_BY_ID   = "ON_SUCCESS_GET_BY_ID";
export const UPDATE                 = "UPDATE";
export const ON_SUCCESS_UPDATE      = "ON_SUCCESS_UPDATE";
export const DEL                    = "DEL";
export const ON_SUCCESS_DEL         = "ON_SUCCESS_DEL";
export const ERROR                  = "ERROR";


export default combineReducers({
    list,
    add,
    profile,
    ui,
    listMod,
});
