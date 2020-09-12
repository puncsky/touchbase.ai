import { Button, notification } from "antd";
import Popover from "antd/lib/popover";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Mutation, MutationFn } from "react-apollo";
import OutsideClickHandler from "react-outside-click-handler";
import { RouterProps, withRouter } from "react-router";
import { styled } from "styletron-react";
import { TInteraction } from "../../types/human";
import { CommonMargin } from "../common/common-margin";
import { Flex } from "../common/flex";
import { GET_INTERACTIONS } from "./contact-detail";

const DELETE_NOTE = gql`
  mutation deleteNote($id: String!) {
    deleteNote(deleteNoteInput: { _id: $id })
  }
`;
function updateStore(
  store: any,
  { data: { deleteNote } }: any,
  isSelf: boolean,
  contactId: string,
  noteId: string
): void {
  if (!deleteNote) {
    return;
  }
  const results: {
    interactions: {
      interactions: [TInteraction];
      count: number;
      __typename: string;
    };
  } | null = store.readQuery({
    query: GET_INTERACTIONS,
    variables: isSelf ? { isSelf } : { contactId }
  });
  if (!results) {
    return;
  }
  const { __typename, count, interactions } = results.interactions;
  const filteredArray = interactions.filter(item => item.id !== noteId);
  store.writeQuery({
    query: GET_INTERACTIONS,
    data: {
      interactions: {
        interactions: filteredArray,
        __typename,
        count: count - 1
      }
    },
    variables: isSelf ? { isSelf } : { contactId }
  });
}

export const DeleteNotePopover = withRouter(
  // @ts-ignore
  class DeleteNotePopoverInner extends Component<
    { noteId: string; contactId: string; isSelf: boolean } & RouterProps,
    { visible: boolean }
  > {
    state: { visible: boolean } = { visible: false };

    render(): JSX.Element {
      const { noteId, contactId, isSelf } = this.props;
      const content = (
        <OutsideClickHandler
          onOutsideClick={() => this.setState({ visible: false })}
        >
          <PopoverContent>
            <div>{t(t("field.delete_note.content"))}</div>
            <CommonMargin />
            <div>
              <Flex justifyContent="flex-start">
                <Mutation mutation={DELETE_NOTE}>
                  {(
                    deleteContact: MutationFn<{ id: string }>,
                    { loading }: { loading: boolean }
                  ) => {
                    return (
                      // @ts-ignore
                      <Button
                        danger
                        loading={loading}
                        onClick={async () => {
                          try {
                            await deleteContact({
                              variables: { id: noteId },
                              update: (store, data) =>
                                updateStore(
                                  store,
                                  data,
                                  isSelf,
                                  contactId,
                                  noteId
                                )
                            });
                            this.setState({ visible: false });
                            notification.success({
                              message: t("field.delete_note.deleted", {
                                name
                              })
                            });
                          } catch (e) {
                            const filtered = String(e).replace(
                              "Error: GraphQL error:",
                              ""
                            );
                            notification.error({
                              message: t("field.delete_note.failed", {
                                e: filtered
                              })
                            });
                          }
                        }}
                      >
                        {t("field.delete_note.yes")}
                      </Button>
                    );
                  }}
                </Mutation>
                <CommonMargin />
                <Button onClick={() => this.setState({ visible: false })}>
                  {t("field.delete_note.cancel")}
                </Button>
              </Flex>
            </div>
          </PopoverContent>
        </OutsideClickHandler>
      );
      return (
        <Popover
          visible={this.state.visible}
          trigger="click"
          content={content}
          title={t("field.delete_note.title")}
        >
          <Button
            size="small"
            type="link"
            onClick={() => this.setState({ visible: true })}
          >
            {t("delete")}
          </Button>
        </Popover>
      );
    }
  }
);

const PopoverContent = styled("div", {
  maxWidth: "350px"
});
