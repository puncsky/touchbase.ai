import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Rate,
  Row,
  Select
} from "antd";
import { FormInstance } from "antd/lib/form/Form";
import moment from "moment";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { TContact2 } from "../../types/human";
import { EMPTY_HUMAN } from "./profile-creator";

const { Option } = Select;

type State = {
  confirmDirty: boolean;
};

type Props = {
  human?: TContact2;
};

class HumanForm extends Component<Props, State> {
  formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();

  public state: State = {
    confirmDirty: false
  };

  public props: Props;

  public handleFinish = (values: any) => {
    // eslint-disable-next-line no-undef
    window.console.log("Received values of form: ", values);
  };

  public onFinishFailed = ({ errorFields }: any) => {
    if (this.formRef.current) {
      this.formRef.current.scrollToField(errorFields[0].name);
    }
  };

  public validateName = (_: any, value: string) => {
    if (value && this.state.confirmDirty && this.formRef.current) {
      this.formRef.current.validateFields(["confirm"]);
    }
    return Promise.resolve();
  };

  // tslint:disable-next-line:max-func-body-length
  public render(): JSX.Element {
    const human: TContact2 = this.props.human || EMPTY_HUMAN;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };
    const prefixSelector = (
      <Form.Item name="prefix" noStyle>
        <Select style={{ width: 70 }}>
          <Option value="86">86</Option>
          <Option value="1">1</Option>
        </Select>
      </Form.Item>
    );

    return (
      <Form
        onFinish={this.handleFinish}
        onFinishFailed={this.onFinishFailed}
        ref={this.formRef}
        initialValues={{
          avatarUrl: human.avatarUrl,
          email: human.emails[0],
          name: human.name,
          address: human.address,
          bornAddress: human.bornAddress,
          bornAt: moment(human.bornAt || "1980-1-1"),
          blurb: human.blurb,
          workingOn: human.workingOn,
          desire: human.desire,
          extraversionIntroversion: human.extraversionIntroversion,
          intuitingSensing: human.intuitingSensing,
          thinkingFeeling: human.thinkingFeeling,
          planingPerceiving: human.planingPerceiving,
          tdp: human.tdp,
          inboundTrust: human.inboundTrust,
          outboundTrust: human.outboundTrust,
          knownAt: moment(),
          knownSource: human.knownSource,
          prefix: "1"
        }}
      >
        {/** ************************************* */}
        <Divider orientation="left">Contact Card</Divider>

        <Form.Item {...formItemLayout} label="avatarUrl" name="avatarUrl">
          <Input />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              {...formItemLayout}
              label={t("field.email")}
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!"
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Button>{t("profile.prefill")}</Button>
          </Col>
        </Row>

        <Form.Item
          {...formItemLayout}
          label={t("field.name")}
          name="name"
          rules={[
            {
              required: true,
              message: "Please input name!"
            },
            {
              validator: this.validateName
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label={t("field.address")}
          name="address"
        >
          <Input />
        </Form.Item>

        <Form.Item {...formItemLayout} label="Phone" name="phone">
          <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item {...formItemLayout} label="Birthplace" name="bornAddress">
          <Input />
        </Form.Item>

        <Form.Item {...formItemLayout} label="Birthday" name="bornAt">
          <DatePicker />
        </Form.Item>

        {/** ************************************* */}
        <Divider orientation="left">Bio</Divider>
        <Form.Item {...formItemLayout} label="blurb" name="blurb">
          <Input />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Working on" name="workingOn">
          <Input />
        </Form.Item>
        <Form.Item {...formItemLayout} label="desire" name="desire">
          <Input />
        </Form.Item>

        {/** ************************************* */}
        <Divider orientation="left">Personalities</Divider>
        <Form.Item
          {...formItemLayout}
          label="E vs I"
          name="extraversionIntroversion"
        >
          <Select placeholder="Tap to select">
            <Option value="introversion">introversion</Option>
            <Option value="extroversion">extroversion</Option>
            <Option value="ambiversion">ambiversion</Option>
          </Select>
        </Form.Item>
        <Form.Item {...formItemLayout} label="N vs S" name="intuitingSensing">
          <Select placeholder="Tap to select">
            <Option value="intuiting">intuiting</Option>
            <Option value="sensing">sensing</Option>
          </Select>
        </Form.Item>
        <Form.Item {...formItemLayout} label="T vs F" name="thinkingFeeling">
          <Select placeholder="Tap to select">
            <Option value="thinking">thinking</Option>
            <Option value="feeling">feeling</Option>
          </Select>
        </Form.Item>
        <Form.Item {...formItemLayout} label="J vs P" name="planingPerceiving">
          <Select placeholder="Tap to select">
            <Option value="planing">planing (or judging)</Option>
            <Option value="perceiving">perceiving</Option>
          </Select>
        </Form.Item>

        <Form.Item {...formItemLayout} label="TDP" name="tdp">
          <Select placeholder="Tap to select">
            <Option value="creator">creator</Option>
            <Option value="refiner">refiner</Option>
            <Option value="advancer">advancer</Option>
            <Option value="executor">executor</Option>
            <Option value="flexor">flexor</Option>
          </Select>
        </Form.Item>
        <Form.Item {...formItemLayout} label="In-trust" name="inboundTrust">
          <Rate />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Out-trust" name="outboundTrust">
          <Rate />
        </Form.Item>
        {/** ************************************* */}
        <Divider orientation="left">How do we meet?</Divider>

        <Form.Item
          {...formItemLayout}
          label="Known Date"
          name="knownAt"
          rules={[{ type: "object" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item {...formItemLayout} label="Known Source" name="knownSource">
          <Input />
        </Form.Item>

        {/** ************************************* */}
        <Divider orientation="left">Social</Divider>

        <Form.Item {...formItemLayout} label="linkedin" name="linkedin">
          <Input />
        </Form.Item>

        <Form.Item {...formItemLayout} label="facebook" name="facebook">
          <Input />
        </Form.Item>

        <Form.Item {...formItemLayout} label="github" name="github">
          <Input />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          {/*
          // @ts-ignore */}
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

// @ts-ignore
export const WrappedHumanForm = HumanForm;
