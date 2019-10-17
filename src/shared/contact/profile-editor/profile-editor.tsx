// @flow
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  Modal,
  notification,
  Tabs,
  Upload
} from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Popover from "antd/lib/popover";
import window from "global/window";
import gql from "graphql-tag";
import omitBy from "lodash.omitby";
import moment from "moment";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Mutation, MutationFn } from "react-apollo";
import OutsideClickHandler from "react-outside-click-handler";
import { connect } from "react-redux";
import { RouterProps, withRouter } from "react-router";
import { styled } from "styletron-react";
import { TContact2 } from "../../../types/human";
import { CommonMargin } from "../../common/common-margin";
import { Flex } from "../../common/flex";
import { TOP_BAR_HEIGHT } from "../../common/top-bar";
import { upload } from "../../common/upload";
import { GET_CONTACTS } from "../../contacts/contacts-table";
import { actionUpdateHuman } from "../human-reducer";
import PhoneInput from "../phone-input";
import { formatToE164 } from "../phone-input/util";
import DynamicFormItems from "./dynamic-form-items";
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
  human: TContact2;
  actionUpdateHuman?(payload: any, remoteOnly: boolean): void;
  history?: any;
  form?: WrappedFormUtils;
};

type State = { visible: boolean };

// @ts-ignore
@Form.create({ name: "profile-editor" })
// @ts-ignore
@withRouter
// @ts-ignore
@connect(
  () => ({}),
  (dispatch: any) => ({
    actionUpdateHuman: (payload, remoteOnly) =>
      dispatch(actionUpdateHuman(payload, remoteOnly))
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

    if (!form || !actionUpdateHuman) {
      return;
    }

    const result = form.getFieldsValue();
    const clone = {
      ...human,
      ...result,
      // @ts-ignore
      emails: result.emails.split(","),
      experience: (result.experience || []).filter((e: any) => e),
      education: (result.education || []).filter((e: any) => e)
    };
    actionUpdateHuman(omitBy(clone, val => !val && val !== 0), false);

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
  human: TContact2;
}> {
  public render(): JSX.Element {
    const { form, human } = this.props;
    return (
      <Form>
        <Tabs defaultActiveKey="1" tabPosition={"left"}>
          <TabPane forceRender tab={t("profile_editor.pii")} key="1">
            <PersonalForm form={form} human={human} />
          </TabPane>
          <TabPane forceRender tab={t("profile_editor.experience")} key="2">
            <ExperienceForm form={form} human={human} />
          </TabPane>
          <TabPane forceRender tab={t("profile_editor.observation")} key="3">
            <ObservationForm form={form} human={human} />
          </TabPane>
        </Tabs>
      </Form>
    );
  }
}

interface PersonalFormState {
  avatarUrl: string;
}

class PersonalForm extends Component<
  {
    human: TContact2;
    form?: WrappedFormUtils;
  },
  PersonalFormState
> {
  state: PersonalFormState = { avatarUrl: "" };

  renderPhoneNumbers(): JSX.Element | null {
    const { human, form } = this.props;
    return (
      <DynamicFormItems
        itemSize={human.phones.length}
        label={t("field.phone")}
        renderItem={(key, i) =>
          (form as WrappedFormUtils).getFieldDecorator(`phones[${i}]`, {
            initialValue: human.phones[key],
            validateTrigger: "onBlur",
            rules: [
              {
                // @ts-ignore
                validator(rule: any, val: any, cb: any): void {
                  if (val && formatToE164(val).length <= 3) {
                    cb(t("field.error.phone.format"));
                  } else {
                    cb();
                  }
                }
              }
            ]
          })(<PhoneInput />)
        }
      />
    );
  }

  render(): JSX.Element | null {
    const { human, form } = this.props;

    if (!form) {
      return null;
    }
    const { getFieldDecorator } = form;

    const beforeUpload = async ({ file, onSuccess }: any) => {
      const fieldName = "avatarUrl";
      const data = await upload(file, fieldName);
      form.setFieldsValue({
        [fieldName]: data.secure_url
      });
      this.setState({ [fieldName]: data.secure_url });
      onSuccess(data, file);
    };

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

        {this.renderPhoneNumbers()}

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
          <Upload customRequest={beforeUpload}>
            {human.avatarUrl ? (
              <img
                alt="avatar"
                style={{ width: "50%", cursor: "pointer" }}
                src={this.state.avatarUrl || human.avatarUrl}
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
        {human._id && (
          <DeleteContactPopover
            name={human.name}
            contactId={String(human._id)}
          />
        )}
      </>
    );
  }
}

const DELETE_CONTACT = gql`
  mutation deleteContact($id: String!) {
    deleteContact(deleteContactInput: { _id: $id })
  }
`;

const DeleteContactPopover = withRouter(
  // @ts-ignore
  class DeleteContactPopoverInner extends Component<
    { name: string; contactId: string } & RouterProps,
    { visible: boolean }
  > {
    state: { visible: boolean } = { visible: false };

    render(): JSX.Element {
      const { name, contactId, history } = this.props;

      const content = (
        <OutsideClickHandler
          onOutsideClick={() => this.setState({ visible: false })}
        >
          <PopoverContent>
            <div>{t(t("field.delete_contact.content"), { name })}</div>
            <CommonMargin />
            <div>
              <Flex justifyContent="flex-start">
                <Mutation mutation={DELETE_CONTACT}>
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
                              refetchQueries: [
                                {
                                  query: GET_CONTACTS
                                }
                              ],
                              variables: { id: contactId }
                            });
                            history.push("/contacts/");
                            notification.success({
                              message: t("field.delete_contact.deleted", {
                                name
                              })
                            });
                          } catch (e) {
                            const filtered = String(e).replace(
                              "Error: GraphQL error:",
                              ""
                            );
                            notification.error({
                              message: t("field.delete_contact.failed", {
                                e: filtered
                              })
                            });
                          }
                        }}
                      >
                        {t("field.delete_contact.yes")}
                      </Button>
                    );
                  }}
                </Mutation>
                <CommonMargin />
                <Button onClick={() => this.setState({ visible: false })}>
                  {t("field.delete_contact.cancel")}
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
          title={t("field.delete_contact.title")}
        >
          <Button onClick={() => this.setState({ visible: true })}>
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

function SocialNetworkForm({
  human,
  form
}: {
  human: TContact2;
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
  human: TContact2;
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
