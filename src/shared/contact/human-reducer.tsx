// @flow
import axios from "axios";
import gql from "graphql-tag";
import { TInteraction, TContact2 } from "../../types/human";

import { apolloClient } from "../common/apollo-client";
import { csrfToken } from "../common/browser-state";
import { GET_CONTACTS } from "../contacts/contacts-table";
import { GET_CONTACT, GET_INTERACTIONS } from "./contact-detail";

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

const UPSERT_INTERACTION = gql`
  mutation upsertInteraction($upsertInteraction: UpsertInteraction!) {
    upsertInteraction(upsertInteraction: $upsertInteraction) {
      id
      timestamp
      content
      relatedHumans
      public
    }
  }
`;

export function actionUpsertEvent(
  payload: any,
  contactId: string,
  isSelf = true
): any {
  return (dispatch: any) => {
    apolloClient
      .mutate<{ upsertInteraction: { _id: string } }>({
        mutation: UPSERT_INTERACTION,
        variables: { upsertInteraction: payload },
        // @ts-ignore
        update: (
          store,
          {
            data: { upsertInteraction }
          }: { data: { upsertInteraction: TInteraction } }
        ) => {
          const variables = isSelf ? { isSelf: true } : { contactId };

          const results: {
            interactions: {
              interactions: [TInteraction];
              count: number;
            };
          } | null = store.readQuery({
            query: GET_INTERACTIONS,
            variables
          });

          if (!results) {
            store.writeQuery({
              query: GET_INTERACTIONS,
              data: {
                interactions: {
                  interactions: [upsertInteraction],
                  count: 1,
                  __typename: "InteractionConnection"
                }
              },
              variables
            });
            return;
          }

          const {
            interactions: { interactions, count }
          } = results;

          let isInsert = true;

          let newInteractions = interactions.map(item => {
            if (item.id === upsertInteraction.id) {
              isInsert = false;
              return {
                ...item,
                ...upsertInteraction
              };
            }
            return item;
          });

          if (isInsert) {
            newInteractions = [upsertInteraction, ...newInteractions];
          }

          store.writeQuery({
            query: GET_INTERACTIONS,
            data: {
              interactions: {
                interactions: newInteractions,
                count: isInsert ? count + 1 : count,
                __typename: "InteractionConnection"
              }
            },
            variables
          });
        }
      })
      .then((resp: { data: { upsertInteraction: any } }) => {
        // TODO(tian): error handling
        dispatch({
          type: UPSERT_EVENT,
          payload: resp.data && resp.data.upsertInteraction
        });
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

const UPDATE_CONTACT = gql`
  mutation updateContact($updateContactInput: UpdateContactInput!) {
    updateContact(updateContactInput: $updateContactInput) {
      _id
    }
  }
`;

export function actionUpdateHuman(payload: any, remoteOnly = false): any {
  return (dispatch: any) => {
    if (!remoteOnly) {
      dispatch({
        type: UPDATE_HUMAN,
        payload
      });
    }

    apolloClient.mutate<{ updateContact: { _id: string } }>({
      mutation: UPDATE_CONTACT,
      variables: { updateContactInput: payload },
      refetchQueries: [{ query: GET_CONTACT, variables: { id: payload._id } }]
    });
  };
}

const CREATE_CONTACT = gql`
  mutation createContact($createContactInput: CreateContactInput!) {
    createContact(createContactInput: $createContactInput) {
      _id
    }
  }
`;

export function actionCreateHuman(payload: TContact2, history: any): any {
  return (dispatch: any) => {
    dispatch({
      type: CREATE_HUMAN,
      payload
    });
    dispatch({
      type: CLEAR_LOCAL_EVENS
    });

    apolloClient
      .mutate<{ createContact: { _id: string } }>({
        mutation: CREATE_CONTACT,
        variables: { createContactInput: payload },
        refetchQueries: [
          {
            query: GET_CONTACTS
          }
        ]
      })
      .then(resp => {
        setTimeout(() => {
          if (!resp.data) {
            return;
          }
          history.push(`/${resp.data.createContact._id}/`);
        }, 1000);
      });
  };
}
