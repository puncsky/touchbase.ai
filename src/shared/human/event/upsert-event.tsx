// @flow
import { Modal } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { THuman } from "../../../types/human";
import { MdEditor } from "../../common/md-editor";
import { TOP_BAR_HEIGHT } from "../../common/top-bar";
import { actionUpsertEvent } from "../human-reducer";

type Props = {
  // container
  actionUpsertEvent(payload: any): void;
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
  (state: { base: { ownerHumanId: string }; human: THuman }) => ({
    ownerHumanId: state.base.ownerHumanId,
    humanId: state.human._id
  }),
  (dispatch: any) => ({
    actionUpsertEvent: payload => dispatch(actionUpsertEvent(payload))
  })
)(
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
            onCancel={() => this.setState({ isVisible: false })}
            onOk={() => {
              actionUpsertEvent({
                id: eventId,
                content: this.getSimpleMde().value(),
                relatedContacts: [ownerHumanId, humanId]
              });
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
