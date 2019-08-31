// @flow
import Form from "antd/lib/form/Form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Modal from "antd/lib/modal";
import notification from "antd/lib/notification";
import window from "global/window";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RouterProps, withRouter } from "react-router";
import { TContact2 } from "../../types/human";
import { TOP_BAR_HEIGHT } from "../common/top-bar";
import { actionCreateHuman } from "./human-reducer";
import { ProfileEditorForm } from "./profile-editor/profile-editor";

export const EMPTY_HUMAN: TContact2 = {
  emails: [""],
  name: "",
  avatarUrl: "",
  address: "",
  bornAt: "",
  bornAddress: "",
  workingOn: "",
  desire: "",
  title: "",
  experience: [
    {
      title: "",
      name: ""
    }
  ],
  education: [
    {
      title: "",
      name: ""
    }
  ],
  extraversionIntroversion: "",
  facebook: "",
  intuitingSensing: "",
  knownAt: new Date(),
  knownSource: "",
  linkedin: "",
  planingPerceiving: "",
  tdp: "",
  thinkingFeeling: "",
  blurb: "",
  inboundTrust: 1,
  outboundTrust: 1
};

type Props = {
  human: TContact2;
  actionCreateHuman(payload: any, history: any): void;
  form?: WrappedFormUtils;
} & RouterProps;

type State = { visible: boolean };

export const ProfileCreatorContainer = Form.create({ name: "profile-creator" })(
  // @ts-ignore
  withRouter(
    // @ts-ignore
    connect(
      () => ({ human: EMPTY_HUMAN }),
      (dispatch: any) => ({
        actionCreateHuman: (payload, history) =>
          dispatch(actionCreateHuman(payload, history))
      })
    )(
      class ProfileCreator extends Component<Props, State> {
        public props: Props;
        public state: State = { visible: false };
        public ref: any;

        public componentDidMount(): void {
          const { history } = this.props;
          this.setState({
            visible: history.location.pathname.endsWith("/create/")
          });
        }

        public close(): void {
          const { history } = this.props;

          this.setState({ visible: false });
          window.setTimeout(() => history.push("../"), 200);
        }

        public onOk(): void {
          const { form, human, actionCreateHuman, history } = this.props;

          if (!form) {
            return;
          }

          form.validateFields((errors: any, result: any) => {
            if (errors) {
              notification.error({ message: t("field.error.required.name") });
              return;
            }

            const clone = {
              ...human,
              ...result,
              // @ts-ignore
              emails: result.emails.split(",")
            };
            actionCreateHuman(clone, history);

            this.setState({ visible: false });
          });
        }

        public render(): JSX.Element {
          const { human, form } = this.props;
          const { visible } = this.state;
          return (
            <Modal
              style={{ top: TOP_BAR_HEIGHT }}
              title={t("submit")}
              visible={visible}
              onOk={() => this.onOk()}
              onCancel={() => this.close()}
            >
              <ProfileEditorForm human={human} form={form} />
            </Modal>
          );
        }
      }
    )
  )
);
