import Button from "antd/lib/button";
import notification from "antd/lib/notification";
import Popover from "antd/lib/popover";
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { styled } from "styletron-react";
import { TInteraction } from "../../types/human";
import { CommonMargin } from "../common/common-margin";
import { Flex } from "../common/flex";
import { getInteractions } from "./data/queries";
import { useDeleteNote } from "./hooks/useDeleteNote";

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
    query: getInteractions,
    variables: isSelf ? { isSelf } : { contactId }
  });
  if (!results) {
    return;
  }
  const { __typename, count, interactions } = results.interactions;
  const filteredArray = interactions.filter(item => item.id !== noteId);
  store.writeQuery({
    query: getInteractions,
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

export function DeleteNotePopover(props: {
  noteId: string;
  contactId: string;
  isSelf: boolean;
}): JSX.Element {
  const { noteId, contactId, isSelf } = props;
  const [visible, setVisible] = useState(false);
  const [deleteNote, { loading }] = useDeleteNote();

  const content = (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <PopoverContent>
        <div>{t("field.delete_note.content")}</div>
        <CommonMargin />
        <div>
          <Flex justifyContent="flex-start">
            <Button
              danger
              loading={loading}
              onClick={async () => {
                try {
                  await deleteNote({
                    variables: { id: noteId },
                    update: (store, data) =>
                      updateStore(store, data, isSelf, contactId, noteId)
                  });
                  setVisible(false);
                  notification.success({
                    message: t("field.delete_note.deleted", {
                      // eslint-disable-next-line no-restricted-globals
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
            <CommonMargin />
            <Button onClick={() => setVisible(false)}>
              {t("field.delete_note.cancel")}
            </Button>
          </Flex>
        </div>
      </PopoverContent>
    </OutsideClickHandler>
  );
  return (
    <Popover
      visible={visible}
      trigger="click"
      content={content}
      title={t("field.delete_note.title")}
    >
      <Button size="small" type="link" onClick={() => setVisible(true)}>
        {t("delete")}
      </Button>
    </Popover>
  );
}

const PopoverContent = styled("div", {
  maxWidth: "350px"
});
