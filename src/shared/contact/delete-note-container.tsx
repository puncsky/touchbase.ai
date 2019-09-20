import { Button, notification } from "antd";
import Popover from "antd/lib/popover";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Mutation, MutationFn } from "react-apollo";
import OutsideClickHandler from "react-outside-click-handler";
import { RouterProps, withRouter } from "react-router";
import { styled } from "styletron-react";
import { CommonMargin } from "../common/common-margin";
import { Flex } from "../common/flex";
import { refetchInteractionsQueries } from "./human-reducer";

const DELETE_NOTE = gql`
  mutation deleteNote($id: String!) {
    deleteNote(deleteNoteInput: { _id: $id })
  }
`;

export const DeleteNotePopover = withRouter(
  // @ts-ignore
  class DeleteNotePopoverInner extends Component<
    { noteId: string; contactId: string } & RouterProps,
    { visible: boolean }
  > {
    state: { visible: boolean } = { visible: false };

    render(): JSX.Element {
      const { noteId, contactId } = this.props;

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
                        type="danger"
                        loading={loading}
                        onClick={async () => {
                          try {
                            await deleteContact({
                              refetchQueries: refetchInteractionsQueries(
                                contactId
                              ),
                              variables: { id: noteId }
                            });
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
          <Button size="small" onClick={() => this.setState({ visible: true })}>
            Delete
          </Button>
        </Popover>
      );
    }
  }
);

const PopoverContent = styled("div", {
  maxWidth: "350px"
});
