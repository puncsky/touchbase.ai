import { Form, Input } from "antd";
import Button from "antd/lib/button/button";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { TContact2 } from "../../../types/human";
import { SmallMargin } from "../../common/common-margin";
import { formItemLayout } from "./profile-editor";

// @ts-ignore
const InputGroup = Input.Group;

const { TextArea } = Input;

function At(): JSX.Element {
  return (
    <Input
      style={{
        width: 40,
        borderLeft: 0,
        pointerEvents: "none",
        backgroundColor: "#fff"
      }}
      placeholder="@"
      disabled
    />
  );
}

class AddNewExp extends Component<
  { form?: WrappedFormUtils; i: number; fieldName: string },
  { shouldNew: boolean }
> {
  state: { shouldNew: boolean } = { shouldNew: false };
  setShouldNew = (flag: boolean) => this.setState({ shouldNew: flag });

  render(): JSX.Element {
    const { form, i, fieldName } = this.props;

    if (!form) {
      return <div />;
    }
    const getFieldDecorator = form.getFieldDecorator;

    if (this.state.shouldNew) {
      return (
        <>
          <SmallMargin />
          <InputGroup key={i} compact>
            {getFieldDecorator(`${fieldName}[${i}].title`, {
              initialValue: "",
              rules: []
            })(
              <Input
                style={{ maxWidth: "180px", textAlign: "center" }}
                placeholder={t("experience.title")}
              />
            )}
            <At />
            {getFieldDecorator(`${fieldName}[${i}].name`, {
              initialValue: "",
              rules: []
            })(
              <Input
                style={{
                  maxWidth: "180px",
                  textAlign: "center",
                  borderLeft: 0
                }}
                placeholder={t("experience.org")}
              />
            )}
          </InputGroup>
          {(() => (
            <AddNewExp form={form} i={i + 1} fieldName={fieldName} />
          ))()}
          he
        </>
      );
    }

    return (
      <>
        <SmallMargin />
        <Button
          onClick={() => this.setShouldNew(true)}
          shape="circle"
          icon="plus"
        />
        <br />
      </>
    );
  }
}

// tslint:disable-next-line:max-func-body-length
export function ExperienceForm({
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
      <Form.Item {...formItemLayout} label={t("field.blurb")}>
        {getFieldDecorator("blurb", {
          initialValue: human.blurb,
          rules: []
        })(<TextArea autosize={true} />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.working_on")}>
        {getFieldDecorator("workingOn", {
          initialValue: human.workingOn,
          rules: []
        })(<TextArea autosize={true} />)}
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.desire")}>
        {getFieldDecorator("desire", {
          initialValue: human.desire,
          rules: []
        })(<TextArea autosize={true} />)}
      </Form.Item>

      <div className="ant-form-item-label">
        <label
          htmlFor="profile-editor_experience[0].title"
          className=""
          title="field.experience"
        >
          {t("field.experience")}
        </label>
      </div>

      {human.experience.map((_: any, i) => {
        return (
          <InputGroup key={i} compact>
            {getFieldDecorator(`experience[${i}].title`, {
              initialValue: human.experience[i].title,
              rules: []
            })(
              <Input
                style={{ maxWidth: "180px", textAlign: "center" }}
                placeholder={t("experience.title")}
              />
            )}
            <At />
            {getFieldDecorator(`experience[${i}].name`, {
              initialValue: human.experience[i].name,
              rules: []
            })(
              <Input
                style={{
                  maxWidth: "180px",
                  textAlign: "center",
                  borderLeft: 0
                }}
                placeholder={t("experience.org")}
              />
            )}
          </InputGroup>
        );
      })}

      <AddNewExp
        form={form}
        i={human.experience.length}
        fieldName="experience"
      />

      <div className="ant-form-item-label">
        <label
          htmlFor="profile-editor_education[0].title"
          className=""
          title="field.education"
        >
          {t("field.education")}
        </label>
      </div>

      {human.education.map((_: any, i) => {
        return (
          <InputGroup key={i} compact>
            {getFieldDecorator(`education[${i}].title`, {
              initialValue: human.education[i].title,
              rules: []
            })(
              <Input
                style={{ maxWidth: "180px", textAlign: "center" }}
                placeholder={t("experience.title")}
              />
            )}
            <At />
            {getFieldDecorator(`education[${i}].name`, {
              initialValue: human.education[i].name,
              rules: []
            })(
              <Input
                style={{
                  maxWidth: "180px",
                  textAlign: "center",
                  borderLeft: 0
                }}
                placeholder={t("experience.org")}
              />
            )}
          </InputGroup>
        );
      })}

      <AddNewExp form={form} i={human.education.length} fieldName="education" />
    </>
  );
}
