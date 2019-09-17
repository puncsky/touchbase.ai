// @flow
import { Modal } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { TContact2 } from "../../../types/human";
import { MdEditor } from "../../common/md-editor";
import { TOP_BAR_HEIGHT } from "../../common/top-bar";
import { actionUpsertEvent } from "../human-reducer";

type Props = {
  // container
  actionUpsertEvent(payload: any, contactId: string, isSelf: boolean): void;
  ownerHumanId: string;
  humanId: string;

  // external
  initialValue: string;
  eventId: string;
  children: any;
};

type State = {
  isVisible: boolean;
};

// @ts-ignore
export const UpsertEventContainer = connect(
  (state: { base: { ownerHumanId: string }; human: TContact2 }) => ({
    ownerHumanId: state.base.ownerHumanId
  }),
  (dispatch: any) => ({
    actionUpsertEvent: (payload: any, contactId: string) =>
      dispatch(actionUpsertEvent(payload, contactId))
  })
)(
  // @ts-ignore
  class Edit extends Component<Props, State> {
    public props: Props;
    public getSimpleMde: any = null;

    public state: State = {
      isVisible: false
    };

    public render(): JSX.Element {
      const {
        actionUpsertEvent,
        ownerHumanId,
        humanId,
        initialValue,
        eventId,
        children
      } = this.props;

      return (
        <div>
          <Modal
            visible={this.state.isVisible}
            style={{ top: TOP_BAR_HEIGHT }}
            title={eventId ? t("edit_event") : t("add_event")}
            onCancel={() => {
              this.setState({ isVisible: false });
              if (!initialValue) {
                this.getSimpleMde().value("");
              }
            }}
            onOk={() => {
              actionUpsertEvent(
                {
                  id: eventId,
                  content: this.getSimpleMde().value(),
                  relatedHumans: [ownerHumanId, humanId],
                  timestamp: new Date()
                },
                humanId,
                ownerHumanId === humanId
              );
              if (!initialValue) {
                this.getSimpleMde().value("");
              }
              this.setState({ isVisible: false });
            }}
          >
            <MdEditor
              initialValue={initialValue}
              getSimpleMde={getSimpleMde => (this.getSimpleMde = getSimpleMde)}
            />
          </Modal>
          <div role="button" onClick={() => this.setState({ isVisible: true })}>
            {children}
          </div>
        </div>
      );
    }
  }
);
