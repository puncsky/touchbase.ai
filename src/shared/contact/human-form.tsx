import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Rate,
  Row,
  // @ts-ignore
  Select
} from "antd";
import { FormProps } from "antd/lib/form/Form";
import moment from "moment";
import { t } from "onefx/lib/iso-i18n";
import React, { Component, FormEvent } from "react";
import { TContact2 } from "../../types/human";
import { EMPTY_HUMAN } from "./profile-creator";

const { Option } = Select;

type State = {
  confirmDirty: boolean;
};

type Props = {
  human: TContact2;
} & FormProps;

class HumanForm extends Component<Props, State> {
  public state: State = {
    confirmDirty: false
  };

  public props: Props;

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { form } = this.props;
    if (form) {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-undef
          window.console.log("Received values of form: ", values);
        }
      });
    }
  };

  public validateName = (_: any, value: string, callback: Function) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty && form) {
      // @ts-ignore
      form.validateFields(["confirm"], { force: true });
    }
    // @ts-ignore
    callback();
  };

  // tslint:disable-next-line:max-func-body-length
  public render(): JSX.Element {
    const getFieldDecorator =
      this.props.form && this.props.form.getFieldDecorator;
    if (!getFieldDecorator) {
      throw new Error("getFieldDecorator is not a function");
    }
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
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "1"
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">86</Option>
        <Option value="1">1</Option>
      </Select>
    );

    return (
      <Form onSubmit={this.handleSubmit}>
        {/****************************************/}
        <Divider orientation="left">Contact Card</Divider>

        <Form.Item {...formItemLayout} label="avatarUrl">
          {getFieldDecorator("avatarUrl", {
            initialValue: human.avatarUrl,
            rules: []
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label={t("field.email")}>
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator("email", {
                initialValue: human.emails[0],
                rules: [
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  }
                ]
              })(<Input />)}
            </Col>

            <Col span={12}>
              <Button>{t("profile.prefill")}</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item {...formItemLayout} label={t("field.name")}>
          {getFieldDecorator("name", {
            initialValue: human.name,
            rules: [
              {
                required: true,
                message: "Please input name!"
              },
              {
                validator: this.validateName
              }
            ]
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label={t("field.address")}>
          {getFieldDecorator("address", {
            initialValue: human.address,
            rules: []
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Phone">
          {getFieldDecorator("phone", {
            rules: []
          })(<Input addonBefore={prefixSelector} style={{ width: "100%" }} />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Birthplace">
          {getFieldDecorator("bornAddress", {
            initialValue: human.bornAddress,
            rules: []
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Birthday">
          {getFieldDecorator("bornAt", {
            initialValue: moment(human.bornAt || "1980-1-1"),
            rules: []
          })(<DatePicker />)}
        </Form.Item>

        {/****************************************/}
        <Divider orientation="left">Bio</Divider>
        <Form.Item {...formItemLayout} label="blurb">
          {getFieldDecorator("blurb", {
            initialValue: human.blurb,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Working on">
          {getFieldDecorator("workingOn", {
            initialValue: human.workingOn,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="desire">
          {getFieldDecorator("desire", {
            initialValue: human.desire,
            rules: []
          })(<Input />)}
        </Form.Item>

        {/****************************************/}
        <Divider orientation="left">Personalities</Divider>
        <Form.Item {...formItemLayout} label="E vs I">
          {getFieldDecorator("extraversionIntroversion", {
            initialValue: human.extraversionIntroversion,
            rules: []
          })(
            <Select placeholder="Tap to select">
              <Option value="introversion">introversion</Option>
              <Option value="extroversion">extroversion</Option>
              <Option value="ambiversion">ambiversion</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="N vs S">
          {getFieldDecorator("intuitingSensing", {
            initialValue: human.intuitingSensing,
            rules: []
          })(
            <Select placeholder="Tap to select">
              <Option value="intuiting">intuiting</Option>
              <Option value="sensing">sensing</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="T vs F">
          {getFieldDecorator("thinkingFeeling", {
            initialValue: human.thinkingFeeling,
            rules: []
          })(
            <Select placeholder="Tap to select">
              <Option value="thinking">thinking</Option>
              <Option value="feeling">feeling</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="J vs P">
          {getFieldDecorator("planingPerceiving", {
            initialValue: human.planingPerceiving,
            rules: []
          })(
            <Select placeholder="Tap to select">
              <Option value="planing">planing (or judging)</Option>
              <Option value="perceiving">perceiving</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item {...formItemLayout} label="TDP">
          {getFieldDecorator("tdp", {
            initialValue: human.tdp,
            rules: []
          })(
            <Select placeholder="Tap to select">
              <Option value="creator">creator</Option>
              <Option value="refiner">refiner</Option>
              <Option value="advancer">advancer</Option>
              <Option value="executor">executor</Option>
              <Option value="flexor">flexor</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="In-trust">
          {getFieldDecorator("inboundTrust", {
            initialValue: human.inboundTrust,
            rules: []
          })(<Rate />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="Out-trust">
          {getFieldDecorator("outboundTrust", {
            initialValue: human.outboundTrust,
            rules: []
          })(<Rate />)}
        </Form.Item>
        {/****************************************/}
        <Divider orientation="left">How do we meet?</Divider>

        <Form.Item {...formItemLayout} label="Known Date">
          {getFieldDecorator("knownAt", {
            initialValue: moment(),
            rules: [{ type: "object" }]
          })(<DatePicker />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="Known Source">
          {getFieldDecorator("knownSource", {
            initialValue: human.knownSource,
            rules: []
          })(<Input />)}
        </Form.Item>

        {/****************************************/}
        <Divider orientation="left">Social</Divider>

        <Form.Item {...formItemLayout} label="linkedin">
          {getFieldDecorator("linkedin", {
            rules: []
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="facebook">
          {getFieldDecorator("facebook", {
            rules: []
          })(<Input />)}
        </Form.Item>

        <Form.Item {...formItemLayout} label="github">
          {getFieldDecorator("github", {
            rules: []
          })(<Input />)}
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
export const WrappedHumanForm = Form.create({ name: "register" })(HumanForm);
