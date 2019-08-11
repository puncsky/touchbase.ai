// @flow
import axios from "axios";
import isBrowser from "is-browser";
import JsonGlobal from "safe-json-globals/get";

const csrfToken = isBrowser && JsonGlobal("state").base.csrfToken;

export const axiosInstance = axios.create({
  timeout: 10000,
  headers: { "x-csrf-token": csrfToken }
});

const UPSERT_EVENT = "UPSERT_EVENT";
const CLEAR_LOCAL_EVENS = "CLEAR_LOCAL_EVENS";

export type TAction = {
  type: string;
  payload: any;
};

export function interactionsReducer(state: any = [], action: TAction): any {
  if (action.type === UPSERT_EVENT) {
    const nextState = [...state];
    let isUpdated = false;
    const filteredNextState = nextState.map(s => {
      // update the exact updated item in local
      if (s.id === action.payload.id) {
        isUpdated = true;
        return {
          ...s,
          ...action.payload
        };
      }
      return s;
    });

    // is an old entry updated
    if (isUpdated) {
      return filteredNextState;
    }
    // is a new entry
    return [action.payload, ...state];
  }
  if (action.type === CLEAR_LOCAL_EVENS) {
    return [];
  }

  return state;
}

export function actionUpsertEvent(payload: any): any {
  return (dispatch: any) => {
    axiosInstance.post("/api/upsertEvent/", payload).then(resp => {
      dispatch({ type: UPSERT_EVENT, payload: resp.data.result });
    });
  };
}

export const UPDATE_HUMAN = "UPDATE_HUMAN";
export const CREATE_HUMAN = "CREATE_HUMAN";

export function humanReducer(state: any = {}, action: TAction): any {
  if (action.type === UPDATE_HUMAN) {
    return {
      ...state,
      ...action.payload
    };
  }
  if (action.type === CREATE_HUMAN) {
    return action.payload;
  }
  return state;
}

export function actionUpdateHuman(
  payload: any,
  remoteOnly: boolean = false
): any {
  return (dispatch: any) => {
    if (!remoteOnly) {
      dispatch({
        type: UPDATE_HUMAN,
        payload
      });
    }

    axiosInstance.post("/api/updateHuman/", payload);
  };
}

export function actionCreateHuman(payload: any): any {
  return (dispatch: any) => {
    dispatch({
      type: CREATE_HUMAN,
      payload
    });
    dispatch({
      type: CLEAR_LOCAL_EVENS
    });

    axiosInstance.post("/api/createHuman/", payload).then(resp => {
      dispatch({
        type: CREATE_HUMAN,
        payload: resp.data.result
      });
    });
  };
}
