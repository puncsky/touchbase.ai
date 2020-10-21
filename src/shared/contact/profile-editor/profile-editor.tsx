// @flow
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Tabs,
  Upload
} from "antd";
import { FormInstance } from "antd/lib/form/Form";
import Popover from "antd/lib/popover";
// @ts-ignore
import window from "global/window";
import gql from "graphql-tag";
// @ts-ignore
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
import { actionUpdateHuman as uploadAction } from "../human-reducer";
import PhoneInput from "../phone-input";
import { formatToE164 } from "../phone-input/util";
import DynamicFormItems from "./dynamic-form-items";
import { ExperienceForm } from "./experience-form";
import { ObservationForm } from "./observation-form";

const { TabPane } = Tabs;

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
};

type State = { visible: boolean };

// @ts-ignore
@withRouter
// @ts-ignore
@connect(
  () => ({}),
  (dispatch: any) => ({
    actionUpdateHuman: (payload: any, remoteOnly: boolean) =>
      dispatch(uploadAction(payload, remoteOnly))
  })
)
class ProfileEditorContainer extends Component<Props, State> {
  public props: Props;

  public state: State = {
    visible: false
  };

  public ref: any;

  formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();

  public close(): void {
    const { history } = this.props;

    this.setState({ visible: false });
    window.setTimeout(() => history.push("../"), 200);
  }

  public onOk(): void {
    const { human, actionUpdateHuman } = this.props;

    if (!actionUpdateHuman) {
      return;
    }

    if (!this.formRef.current) {
      return;
    }

    this.formRef.current
      .validateFields()
      .then(result => {
        const clone = {
          ...human,
          ...result,
          // @ts-ignore
          emails: result.emails.split(","),
          experience: (result.experience || []).filter((e: any) => e),
          education: (result.education || []).filter((e: any) => e),
          // Remove the next line codes if it's no need to handle the old contacts
          // created before the phones features was added. This makes the phone input
          // ui rendered with the old contacts look like more reasonable.
          phones: (result.phones || []).filter((e: any) => e)
        };
        window.console.log(clone);
        actionUpdateHuman(
          omitBy(clone, (val: any) => val === null),
          false
        );

        this.close();
      })
      .catch(({ errorFields }) => {
        if (this.formRef.current) {
          this.formRef.current.scrollToField(errorFields[0].name);
        }
      });
  }

  public componentDidMount(): void {
    const { history } = this.props;
    this.setState({
      visible: history.location.pathname.endsWith("/edit/")
    });
  }

  public render(): JSX.Element {
    const { human } = this.props;
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
        <ProfileEditorForm human={human} ref={this.formRef} />
      </Modal>
    );
  }
}

export { ProfileEditorContainer };
export { ProfileEditorForm };

// eslint-disable-next-line react/display-name
const ProfileEditorForm = React.forwardRef(
  ({ human }: { human: TContact2 }, ref: any) => {
    return (
      <Form
        ref={ref}
        initialValues={{
          phones: human.phones,
          name: human.name,
          emails: human.emails.join(", "),
          avatarUrl: human.avatarUrl,
          address: human.address,
          bornAt: human.bornAt && moment(human.bornAt),
          bornAddress: human.bornAddress,
          facebook: human.facebook,
          linkedin: human.linkedin,
          github: human.github,
          knownAt: moment(human.knownAt),
          knownSource: human.knownSource,
          blurb: human.blurb,
          workingOn: human.workingOn,
          desire: human.desire,
          experience: human.experience,
          education: human.education,
          inboundTrust: human.inboundTrust,
          outboundTrust: human.outboundTrust,
          extraversionIntroversion: human.extraversionIntroversion,
          intuitingSensing: human.intuitingSensing,
          thinkingFeeling: human.thinkingFeeling,
          planingPerceiving: human.planingPerceiving,
          tdp: human.tdp
        }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane forceRender tab={t("profile_editor.pii")} key="1">
            <PersonalForm human={human} formRef={ref} />
          </TabPane>
          <TabPane forceRender tab={t("profile_editor.experience")} key="2">
            <ExperienceForm />
          </TabPane>
          <TabPane forceRender tab={t("profile_editor.observation")} key="3">
            <ObservationForm />
          </TabPane>
        </Tabs>
      </Form>
    );
  }
);

interface PersonalFormState {
  avatarUrl: string;
}

class PersonalForm extends Component<
  {
    human: TContact2;
    formRef: any;
  },
  PersonalFormState
> {
  state: PersonalFormState = { avatarUrl: "" };

  renderPhoneNumbers(): JSX.Element | null {
    return (
      <DynamicFormItems
        name="phones"
        label={t("field.phone")}
        renderItem={field => (
          <Form.Item
            {...field}
            rules={[
              {
                validator(_: any, val: any): Promise<string | void> {
                  if (val && formatToE164(val || "").length < 9) {
                    return Promise.reject(t("field.error.phone.format"));
                  }
                  return Promise.resolve();
                }
              }
            ]}
            getValueFromEvent={event => {
              if (event.value === `+${event.callingCode}`) {
                return "";
              }
              return event.value;
            }}
            noStyle
          >
            <PhoneInput />
          </Form.Item>
        )}
      />
    );
  }

  render(): JSX.Element | null {
    const { human, formRef } = this.props;

    const beforeUpload = async ({ file, onSuccess }: any) => {
      const fieldName = "avatarUrl";
      const data = await upload(file, fieldName);
      if (formRef && formRef.current) {
        formRef.current.setFieldsValue({
          [fieldName]: data.secure_url
        });
        this.setState({ [fieldName]: data.secure_url });
        onSuccess(data, file);
      }
    };

    return (
      <>
        <Form.Item
          {...formItemLayout}
          label={t("field.name")}
          rules={[
            {
              required: true,
              message: t("field.error.required.name")
            }
          ]}
          name="name"
        >
          <Input placeholder={t("field.jane_doe")} />
        </Form.Item>

        {this.renderPhoneNumbers()}

        <Form.Item {...formItemLayout} label={t("field.emails")} name="emails">
          <Input placeholder={t("field.emails")} />
        </Form.Item>

        <Form.Item {...formItemLayout} label={t("field.avatar_url")}>
          <Form.Item name="avatarUrl" noStyle>
            <Input hidden={true} />
          </Form.Item>
          <Upload customRequest={beforeUpload}>
            {human.avatarUrl ? (
              <img
                alt="avatar"
                style={{ width: "50%", cursor: "pointer" }}
                src={this.state.avatarUrl || human.avatarUrl}
              />
            ) : (
              <Button>
                <UploadOutlined /> Click to Upload
              </Button>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label={t("field.address")}
          name="address"
        >
          <Input placeholder={t("field.address")} />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label={t("field.dateOfBirth")}
          name="bornAt"
        >
          <DatePicker placeholder={t("field.dateOfBirth")} />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label={t("field.birthplace")}
          name="bornAddress"
        >
          <Input placeholder={t("field.birthplace")} />
        </Form.Item>

        <SocialNetworkForm />

        <SourceForm />
        {human._id && (
          <DeleteContactPopover
            // @ts-ignore
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
                        danger
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
            {t("delete")}
          </Button>
        </Popover>
      );
    }
  }
);

const PopoverContent = styled("div", {
  maxWidth: "350px"
});

function SocialNetworkForm(): JSX.Element | null {
  return (
    <>
      <Divider>{t("social_network")}</Divider>
      <Form.Item
        {...formItemLayout}
        label={t("field.facebook")}
        name="facebook"
      >
        <Input />
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.linkedin")}
        name="linkedin"
      >
        <Input />
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.github")} name="github">
        <Input />
      </Form.Item>
    </>
  );
}

function SourceForm(): JSX.Element | null {
  return (
    <>
      <Divider>{t("source")}</Divider>
      <Form.Item {...formItemLayout} label={t("field.known_at")} name="knownAt">
        <DatePicker />
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.known_source")}
        name="knownSource"
      >
        <Input />
      </Form.Item>
    </>
  );
}
