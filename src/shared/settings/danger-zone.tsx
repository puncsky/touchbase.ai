import { notification } from "antd";
import Button from "antd/lib/button/button";
import Modal from "antd/lib/modal";
import Typography from "antd/lib/typography";
import serialize from "form-serialize";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import Mutation, { MutationFn } from "react-apollo/Mutation";
import { Flex } from "../common/flex";
import { FieldMargin } from "../onefx-auth-provider/email-password-identity-provider/view/field-margin";
import { FormContainer } from "../onefx-auth-provider/email-password-identity-provider/view/form-container";
import { InputError } from "../onefx-auth-provider/email-password-identity-provider/view/input-error";
import { InputLabel } from "../onefx-auth-provider/email-password-identity-provider/view/input-label";
import { TextInput } from "../onefx-auth-provider/email-password-identity-provider/view/text-input";

const { Text } = Typography;
const VERIFICATION_FORM = "VERIFICATION_FORM";

const DELETE_ACCOUNT = gql`
  mutation deleteAccount($email: String!) {
    deleteAccount(deleteAccountInput: { email: $email })
  }
`;

function validateEmail(email: string): boolean {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

type State = {
  modalShow: boolean;
  emailError: string;
  codeError: string;
};

export class DangerZone extends Component<{}, State> {
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

  public handleOk = async (func: MutationFn<{ email: string }>) => {
    const el = window.document.getElementById(
      VERIFICATION_FORM
    ) as HTMLFormElement;
    const { email = "", code = "" } = serialize(el, {
      hash: true
    }) as {
      email: string;
      code: string;
    };
    window.console.log(email);

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

  public handleCancel = () => {
    this.setState({
      modalShow: false
    });
  };

  public render(): JSX.Element {
    const { emailError, codeError } = this.state;

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
        <Button type="danger" onClick={this.showModal}>
          {t("settings.deleteAccount")}
        </Button>
        <Modal
          title={t("settings.modal_title")}
          visible={this.state.modalShow}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Mutation mutation={DELETE_ACCOUNT}>
            {(
              deleteContact: MutationFn<{ email: string }>,
              { loading }: { loading: boolean }
            ) => {
              return (
                <FormContainer id={VERIFICATION_FORM}>
                  <Text mark>{t("settings.modal_danger")}</Text>
                  <p>
                    <Text>{t("settings.modal_email_delete_desc")}</Text>
                  </p>
                  <FieldMargin>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextInput
                      id="email"
                      type="email"
                      aria-label="email"
                      name="email"
                      required={true}
                      error={""}
                    />
                    <InputError>{emailError || "\u0020"}</InputError>
                  </FieldMargin>
                  <FieldMargin>
                    <InputLabel>
                      {t("settings.code_verify_prompt") +
                        t("settings.verification_code")}
                    </InputLabel>
                    <TextInput
                      id="code"
                      type="text"
                      aria-label="code"
                      name="code"
                      error={""}
                    />
                    <InputError>{codeError || "\u0020"}</InputError>
                  </FieldMargin>
                  <FieldMargin>
                    <Button
                      type="danger"
                      htmlType="submit"
                      // @ts-ignore
                      onClick={(e: Event) => {
                        e.preventDefault();
                        this.handleOk(deleteContact);
                      }}
                      style={{ width: "100%" }}
                      size="large"
                      loading={loading}
                    >
                      {t("settings.deleteAccount")}
                    </Button>
                  </FieldMargin>
                </FormContainer>
              );
            }}
          </Mutation>
        </Modal>
      </Flex>
    );
  }
}
