import { Form } from "antd";
import Button from "antd/lib/button/button";
import Modal from "antd/lib/modal";
import Typography from "antd/lib/typography";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Flex } from "../common/flex";
import { FieldMargin } from "../onefx-auth-provider/email-password-identity-provider/view/field-margin";
import { InputError } from "../onefx-auth-provider/email-password-identity-provider/view/input-error";
import { InputLabel } from "../onefx-auth-provider/email-password-identity-provider/view/input-label";
import { TextInput } from "../onefx-auth-provider/email-password-identity-provider/view/text-input";
const { Text } = Typography;

type State = {
  modalShow: boolean;
};

export class DangerZone extends Component<{}, State> {
  public constructor(props: any) {
    super(props);
    this.state = {
      modalShow: false
    };
  }

  public showModal = () => {
    this.setState({
      modalShow: true
    });
  };

  public handleOk = () => {
    this.setState({
      modalShow: false
    });
  };

  public handleCancel = () => {
    this.setState({
      modalShow: false
    });
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
        <Button type="danger" onClick={this.showModal}>
          {t("settings.deleteAccount")}
        </Button>
        <Modal
          title={t("settings.modal_title")}
          visible={this.state.modalShow}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Text mark>{t("settings.modal_danger")}</Text>
          <p>
            <Text>{t("settings.modal_email_delete_desc")}</Text>
          </p>
          <Form id={"email-verify"}>
            <FieldMargin>
              <InputLabel>{t("settings.modal_email_input_label")}</InputLabel>
              <TextInput
                defaultValue={""}
                error={""}
                type="email"
                aria-label="Your Email"
                name="email"
                placeholder={t("field.email")}
              />
              <InputError> </InputError>
            </FieldMargin>
            <FieldMargin>
              <InputLabel>{t("settings.email_verify")}</InputLabel>
              <TextInput
                defaultValue=""
                error=""
                type="text"
                aria-label="New Password"
                name=""
                placeholder=""
              />
              <InputError> </InputError>
            </FieldMargin>
          </Form>
        </Modal>
      </Flex>
    );
  }
}
