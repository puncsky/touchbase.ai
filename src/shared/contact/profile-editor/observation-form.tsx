import {
  Divider,
  Form,
  Radio,
  // @ts-ignore
  Rate
} from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { TContact2 } from "../../../types/human";
import { formItemLayout } from "./profile-editor";

// tslint:disable-next-line:max-func-body-length
export function ObservationForm({
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
      <Divider>{t("observation.trust.title")}</Divider>
      <Form.Item {...formItemLayout} label={t("field.inbound_trust")}>
        {getFieldDecorator("inboundTrust", {
          initialValue: human.inboundTrust,
          rules: []
        })(<Rate />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.outbound_trust")}>
        {getFieldDecorator("outboundTrust", {
          initialValue: human.outboundTrust,
          rules: []
        })(<Rate />)}
      </Form.Item>

      <Divider>{t("observation.style.title")}</Divider>

      <Form.Item
        {...formItemLayout}
        label={t("field.extroversion_introversion")}
        help={t("field.extroversion_introversion.help")}
      >
        {getFieldDecorator("extraversionIntroversion", {
          initialValue: human.extraversionIntroversion,
          rules: []
        })(
          <Radio.Group>
            <Radio value="introversion">{t("introversion")}</Radio>
            <Radio value="extroversion">{t("extroversion")}</Radio>
          </Radio.Group>
        )}
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.intuiting_sensing")}
        help={t("field.intuiting_sensing.help")}
      >
        {getFieldDecorator("intuitingSensing", {
          initialValue: human.intuitingSensing,
          rules: []
        })(
          <Radio.Group>
            <Radio value="intuiting">{t("intuiting")}</Radio>
            <Radio value="sensing">{t("sensing")}</Radio>
          </Radio.Group>
        )}
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.thinking_feeling")}
        help={t("field.thinking_feeling.help")}
      >
        {getFieldDecorator("thinkingFeeling", {
          initialValue: human.thinkingFeeling,
          rules: []
        })(
          <Radio.Group>
            <Radio value="thinking">{t("thinking")}</Radio>
            <Radio value="feeling">{t("feeling")}</Radio>
          </Radio.Group>
        )}
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.planing_perceiving")}
        help={t("field.planing_perceiving.help")}
      >
        {getFieldDecorator("planingPerceiving", {
          initialValue: human.planingPerceiving,
          rules: []
        })(
          <Radio.Group>
            <Radio value="planing">{t("planning")}</Radio>
            <Radio value="perceiving">{t("perceiving")}</Radio>
          </Radio.Group>
        )}
      </Form.Item>

      <Divider>{t("tdp")}</Divider>

      <Form.Item {...formItemLayout} label={t("field.tdp")}>
        {getFieldDecorator("tdp", {
          initialValue: human.tdp,
          rules: []
        })(
          <Radio.Group>
            <Radio value="creator">{t("creator")}</Radio>
            <Radio value="refiner">{t("refiner")}</Radio>
            <Radio value="advancer">{t("advancer")}</Radio>
            <Radio value="executor">{t("executor")}</Radio>
            <Radio value="flexor">{t("flexor")}</Radio>
          </Radio.Group>
        )}
      </Form.Item>
    </>
  );
}
