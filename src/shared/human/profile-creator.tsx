// @flow
import { Input, Modal } from "antd";
import window from "global/window";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RouterProps, withRouter } from "react-router";
import { THuman } from "../../types/human";
import { TOP_BAR_HEIGHT } from "../common/top-bar";
import { actionCreateHuman } from "./human-reducer";

const { TextArea } = Input;

export const EMPTY_HUMAN = {
  emails: [""],
  name: "unknown",
  avatarUrl: "",
  address: "",
  bornAt: "",
  bornAddress: "",
  workingOn: "",
  desire: "",
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
} & RouterProps;

type State = { visible: boolean };

export const ProfileCreatorContainer = withRouter(
  // @ts-ignore
  connect(
    (state: { human: THuman }) => ({ human: state.human }),
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
        const { actionCreateHuman, history } = this.props;
        const content = this.ref.textAreaRef.value;
        const humanObj = JSON.parse(content.slice(1, content.length - 1));

        actionCreateHuman(humanObj);

        this.setState({ visible: false });
        window.setTimeout(() => {
          if (history.location.pathname === "/contacts/create/") {
            history.push("../");
          } else {
            history.push(`/${humanObj.name.toLowerCase().replace(/ /g, ".")}/`);
          }
        }, 200);
      }

      public render(): JSX.Element {
        const { visible } = this.state;
        return (
          <Modal
            style={{ top: TOP_BAR_HEIGHT }}
            title={t("submit")}
            visible={visible}
            onOk={() => this.onOk()}
            onCancel={() => this.close()}
          >
            <TextArea
              rows={20}
              ref={ref => (this.ref = ref)}
              defaultValue={`\`\n${JSON.stringify(EMPTY_HUMAN, null, 2)}\n\``}
            />
          </Modal>
        );
      }
    }
  )
);
