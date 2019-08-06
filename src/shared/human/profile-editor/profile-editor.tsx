// @flow
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  Modal,
  Tabs,
  Upload
} from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { RcFile } from "antd/lib/upload/interface";
import window from "global/window";
import moment from "moment";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { THuman } from "../../../types/human";
import { TOP_BAR_HEIGHT } from "../../common/top-bar";
import { actionUpdateHuman } from "../human-reducer";
import { ExperienceForm } from "./experience-form";
import { ObservationForm } from "./observation-form";

const TabPane = Tabs.TabPane;

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  },
  colon: false
};

type Props = {
  human: THuman;
  actionUpdateHuman(payload: any): void;
  history: any;
  form?: WrappedFormUtils;
};

type State = { visible: boolean };

// @ts-ignore
@Form.create({ name: "profile-editor" })
// @ts-ignore
@withRouter
// @ts-ignore
@connect(
  (state: { human: THuman }) => ({ human: state.human }),
  (dispatch: any) => ({
    actionUpdateHuman: payload => dispatch(actionUpdateHuman(payload))
  })
)
class ProfileEditorContainer extends Component<Props, State> {
  public props: Props;
  public state: State = {
    visible: false
  };
  public ref: any;

  public close(): void {
    const { history } = this.props;

    this.setState({ visible: false });
    window.setTimeout(() => history.push("../"), 200);
  }

  public onOk(): void {
    const { form, human, actionUpdateHuman } = this.props;

    if (!form) {
      return;
    }

    const result = form.getFieldsValue();
    const clone = {
      ...human,
      ...result,
      // @ts-ignore
      emails: result.emails.split(",")
    };
    actionUpdateHuman(clone);

    this.close();
  }

  public componentDidMount(): void {
    const { history } = this.props;
    this.setState({
      visible: history.location.pathname.endsWith("/edit/")
    });
  }

  public render(): JSX.Element {
    const { human, form } = this.props;
    const { visible } = this.state;

    return (
      <Modal
        style={{ top: TOP_BAR_HEIGHT }}
        title={t("edit")}
        visible={visible}
        onOk={() => this.onOk()}
        onCancel={() => this.close()}
        width={600}
      >
        <ProfileEditorForm human={human} form={form} />
      </Modal>
    );
  }
}

export { ProfileEditorContainer };

export class ProfileEditorForm extends Component<{
  form?: WrappedFormUtils;
  human: THuman;
}> {
  public render(): JSX.Element {
    const { form, human } = this.props;
    return (
      <Form>
        <Tabs defaultActiveKey="1" tabPosition={"left"}>
          <TabPane tab={t("profile_editor.pii")} key="1">
            <PersonalForm form={form} human={human} />
          </TabPane>
          <TabPane tab={t("profile_editor.experience")} key="2">
            <ExperienceForm form={form} human={human} />
          </TabPane>
          <TabPane tab={t("profile_editor.observation")} key="3">
            <ObservationForm form={form} human={human} />
          </TabPane>
        </Tabs>
      </Form>
    );
  }
}

function PersonalForm({
  human,
  form
}: {
  human: THuman;
  form?: WrappedFormUtils;
}): JSX.Element | null {
  if (!form) {
    return null;
  }
  const { getFieldDecorator } = form;
  return (
    <>
      <Form.Item {...formItemLayout} label={t("field.name")}>
        {getFieldDecorator("name", {
          initialValue: human.name,
          rules: [
            {
              required: true,
              message: t("field.error.required.name")
            }
          ]
        })(<Input placeholder={t("field.jane_doe")} />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.emails")}>
        {getFieldDecorator("emails", {
          initialValue: human.emails.join(", "),
          rules: []
        })(<Input placeholder={t("field.emails")} />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.avatar_url")}>
        {getFieldDecorator("avatarUrl", {
          initialValue: human.avatarUrl
        })(<Input hidden={true} />)}
        <Upload beforeUpload={(_: RcFile, __: Array<RcFile>) => true}>
          {human.avatarUrl ? (
            <img
              alt="avatar"
              style={{ width: "50%", cursor: "pointer" }}
              src={human.avatarUrl}
            />
          ) : (
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          )}
        </Upload>
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.address")}>
        {getFieldDecorator("address", {
          initialValue: human.address,
          rules: []
        })(<Input placeholder={t("field.address")} />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.dateOfBirth")}>
        {getFieldDecorator("bornAt", {
          initialValue: human.bornAt && moment(human.bornAt),
          rules: []
        })(<DatePicker placeholder={t("field.dateOfBirth")} />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.birthplace")}>
        {getFieldDecorator("bornAddress", {
          initialValue: human.bornAddress,
          rules: []
        })(<Input placeholder={t("field.birthplace")} />)}
      </Form.Item>

      <SocialNetworkForm form={form} human={human} />

      <SourceForm form={form} human={human} />
    </>
  );
}

function SocialNetworkForm({
  human,
  form
}: {
  human: THuman;
  form?: WrappedFormUtils;
}): JSX.Element | null {
  if (!form) {
    return null;
  }
  const { getFieldDecorator } = form;
  return (
    <>
      <Divider>{t("social_network")}</Divider>
      <Form.Item {...formItemLayout} label={t("field.facebook")}>
        {getFieldDecorator("facebook", {
          initialValue: human.facebook,
          rules: []
        })(<Input />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.linkedin")}>
        {getFieldDecorator("linkedin", {
          initialValue: human.linkedin,
          rules: []
        })(<Input />)}
      </Form.Item>
    </>
  );
}

function SourceForm({
  human,
  form
}: {
  human: THuman;
  form?: WrappedFormUtils;
}): JSX.Element | null {
  if (!form) {
    return null;
  }

  const { getFieldDecorator } = form;

  return (
    <>
      <Divider>{t("source")}</Divider>
      <Form.Item {...formItemLayout} label={t("field.known_at")}>
        {getFieldDecorator("knownAt", {
          initialValue: moment(human.knownAt),
          rules: []
        })(<DatePicker />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.known_source")}>
        {getFieldDecorator("knownSource", {
          initialValue: human.knownSource,
          rules: []
        })(<Input />)}
      </Form.Item>
    </>
  );
}
