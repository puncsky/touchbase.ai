// @flow
import Form from "antd/lib/form/Form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Modal from "antd/lib/Modal";
import notification from "antd/lib/notification";
import window from "global/window";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RouterProps, withRouter } from "react-router";
import { THuman } from "../../types/human";
import { TOP_BAR_HEIGHT } from "../common/top-bar";
import { actionCreateHuman } from "./human-reducer";
import { ProfileEditorForm } from "./profile-editor/profile-editor";

export const EMPTY_HUMAN: THuman = {
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
  knownAt: "2018-10-13T08:00:36.591Z",
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
  human: THuman;
  actionCreateHuman(payload: any): void;
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
        actionCreateHuman: payload => dispatch(actionCreateHuman(payload))
      })
    )(
      class ProfileEditor extends Component<Props, State> {
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
            actionCreateHuman(clone);

            this.setState({ visible: false });
            window.setTimeout(() => {
              if (history.location.pathname === "/contacts/create/") {
                history.push("../");
              } else {
                history.push(
                  `/${clone.name.toLowerCase().replace(/ /g, ".")}/`
                );
              }
            }, 200);
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
