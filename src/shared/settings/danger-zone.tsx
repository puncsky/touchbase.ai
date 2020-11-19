import React, { useState } from "react";
import notification from "antd/lib/notification";
import Button from "antd/lib/button/button";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Modal from "antd/lib/modal";
import Typography from "antd/lib/typography";
import { t } from "onefx/lib/iso-i18n";
import { Flex } from "../common/flex";
import { useDeleteAccount } from "./hooks/useDeleteAccount";

const { Text } = Typography;

function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

type FormProps = {
  modalShow: boolean;
  setModalShow: (show: boolean) => void;
};

export function DangerZoneForm({
  setModalShow,
  modalShow
}: FormProps): JSX.Element {
  const [form] = Form.useForm();

  const [deleteAccount, { loading, data }] = useDeleteAccount();
  const submit = async () => {
    const { code, email } = await form.validateFields();
    setModalShow(false);
    form.resetFields();

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

    await deleteAccount({
      variables: { email }
    });

    setModalShow(false);

    if (data?.deleteAccount) {
      window.location.href = "/logout";
      window.console.log(data);
    } else {
      notification.error({
        message: t("settings.forbidden_action"),
        description: t("auth/invalid-email"),
        duration: 3
      });
    }
  };

  return (
    <Modal
      title={t("settings.modal_title")}
      visible={modalShow}
      footer={null}
      onCancel={() => setModalShow(false)}
    >
      <Form layout="vertical" form={form}>
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
          rules={[{ required: true, message: t("settings.empty_code") }]}
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
              submit();
            }}
            style={{ width: "100%" }}
            size="large"
            loading={loading}
          >
            {t("settings.deleteAccount")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export function DangerZone(): JSX.Element {
  const [modalShow, setModalShow] = useState(false);

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
      <Button
        danger
        onClick={() => setModalShow(true)}
        style={{ margin: "8px 0" }}
      >
        {t("settings.deleteAccount")}
      </Button>
      {/*
       // @ts-ignore */}
      <DangerZoneForm modalShow={modalShow} setModalShow={setModalShow} />
    </Flex>
  );
}
