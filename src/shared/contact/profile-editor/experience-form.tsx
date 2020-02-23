import { Form, Input } from "antd";
import Button from "antd/lib/button/button";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { t } from "onefx/lib/iso-i18n";
import React, { Component, PureComponent } from "react";
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

class DeleteableExp extends PureComponent<
  {
    form: WrappedFormUtils;
    i: number;
    fieldName: string;
    title?: string;
    org?: string;
  },
  { deleted: boolean }
> {
  state: { deleted: boolean } = { deleted: false };

  render(): JSX.Element | null {
    const {
      form: { getFieldDecorator },
      i,
      fieldName,
      title,
      org
    } = this.props;

    if (this.state.deleted) {
      return null;
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "4px 0"
        }}
      >
        <InputGroup compact>
          {getFieldDecorator(`${fieldName}[${i}].title`, {
            initialValue: title || "",
            rules: []
          })(
            <Input
              style={{ maxWidth: "165px", textAlign: "center" }}
              placeholder={t("experience.title")}
            />
          )}
          <At />
          {getFieldDecorator(`${fieldName}[${i}].name`, {
            initialValue: org || "",
            rules: []
          })(
            <Input
              style={{
                maxWidth: "165px",
                textAlign: "center",
                borderLeftWidth: window.innerWidth >= 578 ? 0 : "1px"
              }}
              placeholder={t("experience.org")}
            />
          )}
        </InputGroup>
        <Button
          onClick={() => this.setState({ deleted: true })}
          shape="circle"
          icon="delete"
        />
      </div>
    );
  }
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

    if (this.state.shouldNew) {
      return (
        <>
          <DeleteableExp form={form} i={i} fieldName={fieldName} />
          {(() => (
            <AddNewExp form={form} i={i + 1} fieldName={fieldName} />
          ))()}
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

      <Form.Item {...formItemLayout} label={t("field.experience")}>
        {human.experience.map((_: any, i) => {
          return (
            <DeleteableExp
              key={i}
              fieldName="experience"
              i={i}
              form={form}
              title={human.experience[i].title}
              org={human.experience[i].name}
            />
          );
        })}

        <AddNewExp
          form={form}
          i={human.experience.length}
          fieldName="experience"
        />
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.education")}>
        {human.education.map((_: any, i) => {
          return (
            <DeleteableExp
              key={i}
              fieldName="education"
              i={i}
              form={form}
              title={human.education[i].title}
              org={human.education[i].name}
            />
          );
        })}

        <AddNewExp
          form={form}
          i={human.education.length}
          fieldName="education"
        />
      </Form.Item>
    </>
  );
}
