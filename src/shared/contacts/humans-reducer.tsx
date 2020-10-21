// @flow
import { TContact } from "../../types/contact";
import { TAction, CREATE_HUMAN } from "../contact/human-reducer";

// tslint:disable-next-line:no-any
export function humansReducer(
  state: any = [],
  action: TAction
): Array<TContact> {
  if (action.type === CREATE_HUMAN && action.payload._id) {
    return [action.payload, ...state];
  }
  return state;
}
