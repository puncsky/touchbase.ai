import {
  Divider,
  Form,
  Radio,
  // @ts-ignore
  Rate
} from "antd";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { formItemLayout } from "./profile-editor";

// tslint:disable-next-line:max-func-body-length
export function ObservationForm(): JSX.Element | null {
  return (
    <>
      <Divider>{t("observation.trust.title")}</Divider>
      <Form.Item
        {...formItemLayout}
        label={t("field.inbound_trust")}
        name="inboundTrust"
      >
        <Rate />
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.outbound_trust")}
        name="outboundTrust"
      >
        <Rate />
      </Form.Item>

      <Divider>{t("observation.style.title")}</Divider>

      <Form.Item
        {...formItemLayout}
        label={t("field.extroversion_introversion")}
        help={t("field.extroversion_introversion.help")}
        name="extraversionIntroversion"
      >
        <Radio.Group>
          <Radio value="introversion">{t("introversion")}</Radio>
          <Radio value="extroversion">{t("extroversion")}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.intuiting_sensing")}
        help={t("field.intuiting_sensing.help")}
        name="intuitingSensing"
      >
        <Radio.Group>
          <Radio value="intuiting">{t("intuiting")}</Radio>
          <Radio value="sensing">{t("sensing")}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.thinking_feeling")}
        help={t("field.thinking_feeling.help")}
        name="thinkingFeeling"
      >
        <Radio.Group>
          <Radio value="thinking">{t("thinking")}</Radio>
          <Radio value="feeling">{t("feeling")}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.planing_perceiving")}
        help={t("field.planing_perceiving.help")}
        name="planingPerceiving"
      >
        <Radio.Group>
          <Radio value="planing">{t("planning")}</Radio>
          <Radio value="perceiving">{t("perceiving")}</Radio>
        </Radio.Group>
      </Form.Item>

      <Divider>{t("tdp")}</Divider>

      <Form.Item {...formItemLayout} label={t("field.tdp")} name="tdp">
        <Radio.Group>
          <Radio value="creator">{t("creator")}</Radio>
          <Radio value="refiner">{t("refiner")}</Radio>
          <Radio value="advancer">{t("advancer")}</Radio>
          <Radio value="executor">{t("executor")}</Radio>
          <Radio value="flexor">{t("flexor")}</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
}
