import { notification } from "antd";
import Button from "antd/lib/button/button";
import Form from "antd/lib/form";
import { FormInstance } from "antd/lib/form/Form";
import Input from "antd/lib/input";
import Modal from "antd/lib/modal";
import Typography from "antd/lib/typography";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import Mutation, { MutationFn } from "react-apollo/Mutation";
import { Flex } from "../common/flex";

const { Text } = Typography;

const DELETE_ACCOUNT = gql`
  mutation deleteAccount($email: String!) {
    deleteAccount(deleteAccountInput: { email: $email })
  }
`;

function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

type State = {
  modalShow: boolean;
  emailError: string;
  codeError: string;
};

type Props = unknown;

export class DangerZone extends Component<Props, State> {
  private readonly formRef: React.RefObject<FormInstance> = React.createRef<
    FormInstance
  >();

  public constructor(props: any) {
    super(props);
    this.state = {
      modalShow: false,
      emailError: "",
      codeError: ""
    };
  }

  public showModal = () => {
    this.setState({
      modalShow: true
    });
  };

  public hideModal = () => {
    this.setState({
      modalShow: false
    });
  };

  public submit = async (func: MutationFn<{ email: string }>) => {
    if (!this.formRef.current) {
      return;
    }

    const { code, email } = await this.formRef.current.validateFields();
    this.hideModal();
    if (this.formRef.current) {
      this.formRef.current.resetFields();
    }

    if (code !== t("settings.verification_code")) {
      notification.error({
        message: t("settings.forbidden_action"),
        description: t("settings.invalid_code"),
        duration: 3
      });
      return;
    }
    if (!validateEmail(email)) {
      notification.error({
        message: t("settings.forbidden_action"),
        description: t("auth/invalid-email"),
        duration: 3
      });
      return;
    }

    const result: any = await func({
      variables: { email }
    });

    this.setState({
      modalShow: false
    });

    if (result.data.deleteAccount) {
      window.location.href = "/logout";
      window.console.log(result);
    } else {
      notification.error({
        message: t("settings.forbidden_action"),
        description: t("auth/invalid-email"),
        duration: 3
      });
    }
  };

  public render(): JSX.Element {
    return (
      <Flex
        flexDirection="row"
        alignContent="center"
        justifyContent="space-between"
      >
        <Flex flexDirection="column" justifyContent="center" alignItems="start">
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {t("settings.deleteAccount")}
          </Text>
          <Text>{t("settings.deleteAccountDesc")}</Text>
        </Flex>
        <Button danger onClick={this.showModal} style={{ margin: "8px 0" }}>
          {t("settings.deleteAccount")}
        </Button>
        {/*
         // @ts-ignore */}
        <DangerZoneForm
          ref={this.formRef}
          modalShow={this.state.modalShow}
          submit={(func: MutationFn) => {
            this.submit(func);
          }}
          hide={() => {
            this.hideModal();
          }}
        />
      </Flex>
    );
  }
}

type FormProps = {
  modalShow: boolean;
  submit: any;
  hide: any;
};

const DangerZoneForm = React.forwardRef(
  ({ modalShow, submit, hide }: FormProps, ref: any) => {
    return (
      <Modal
        title={t("settings.modal_title")}
        visible={modalShow}
        footer={null}
        onCancel={hide}
      >
        <Mutation mutation={DELETE_ACCOUNT}>
          {(
            deleteContact: MutationFn<{ email: string }>,
            { loading }: { loading: boolean }
          ) => {
            return (
              <Form layout="vertical" ref={ref}>
                <Text mark>{t("settings.modal_danger")}</Text>
                <p>
                  <Text>{t("settings.modal_email_delete_desc")}</Text>
                </p>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: t("auth/invalid-email")
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={`${t("settings.code_verify_prompt")} ${t(
                    "settings.verification_code"
                  )}`}
                  name="code"
                  rules={[
                    { required: true, message: t("settings.empty_code") }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button
                    danger
                    htmlType="submit"
                    // @ts-ignore
                    onClick={(e: Event) => {
                      e.preventDefault();
                      submit(deleteContact);
                    }}
                    style={{ width: "100%" }}
                    size="large"
                    loading={loading}
                  >
                    {t("settings.deleteAccount")}
                  </Button>
                </Form.Item>
              </Form>
            );
          }}
        </Mutation>
      </Modal>
    );
  }
);
