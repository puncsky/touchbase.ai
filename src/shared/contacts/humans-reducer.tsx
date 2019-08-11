// @flow
import { TContact } from "../../types/contact";
import { TAction } from "../human/human-reducer";
import { CREATE_HUMAN } from "../human/human-reducer";

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
