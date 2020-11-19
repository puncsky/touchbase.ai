import { FormInstance } from "antd/lib/form/Form";
import Modal from "antd/lib/modal";
import notification from "antd/lib/notification";
// @ts-ignore
import window from "global/window";
// @ts-ignore
import omitBy from "lodash.omitby";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RouterProps, withRouter } from "react-router";
import { TContact2 } from "../../types/human";
import { TOP_BAR_HEIGHT } from "../common/top-bar";
import { actionCreateHuman as createHuman } from "./human-reducer";
import { ProfileEditorForm } from "./profile-editor/profile-editor";

export const EMPTY_HUMAN: TContact2 = {
  emails: [""],
  phones: [""],
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
  github: "",
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
} & RouterProps;

type State = { visible: boolean };

export const ProfileCreatorContainer = withRouter(
  // @ts-ignore
  connect(
    () => ({ human: EMPTY_HUMAN }),
    (dispatch: any) => ({
      actionCreateHuman: (payload: any, history: any) =>
        dispatch(createHuman(payload, history))
    })
  )(
    class ProfileCreator extends Component<Props, State> {
      public props: Props;

      public state: State = { visible: false };

      public ref: any;

      formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();

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
        const { human, actionCreateHuman, history } = this.props;

        if (!this.formRef.current) {
          return;
        }

        this.formRef.current
          .validateFields()
          .then(values => {
            const clone = {
              ...human,
              ...values,
              emails: values.emails.split(",")
            };
            actionCreateHuman(
              omitBy(clone, (val: any) => !val && val !== 0),
              history
            );

            this.setState({ visible: false });
          })
          .catch(({ errorFields }) => {
            if (this.formRef.current) {
              this.formRef.current.scrollToField(errorFields[0].name);
            }
            notification.error({ message: t("field.error.required.name") });
          });
      }

      public render(): JSX.Element {
        const { human } = this.props;
        const { visible } = this.state;
        return (
          <Modal
            style={{ top: TOP_BAR_HEIGHT }}
            title={t("auth/button_submit")}
            visible={visible}
            onOk={() => this.onOk()}
            onCancel={() => this.close()}
            width={600}
          >
            {/*
            @ts-ignore */}
            <ProfileEditorForm human={human} ref={this.formRef} />
          </Modal>
        );
      }
    }
  )
);
