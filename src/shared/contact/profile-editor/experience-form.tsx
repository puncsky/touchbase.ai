import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Input from "antd/lib/input";
import Form from "antd/lib/form";
import Button from "antd/lib/button/button";
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
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

class DeleteableExp extends PureComponent<{
  field: any;
  remove(index: number): void;
}> {
  render(): JSX.Element | null {
    const { remove, field } = this.props;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "4px 0"
        }}
      >
        <InputGroup compact>
          <Form.Item name={[field.name, "title"]} noStyle>
            <Input
              style={{ maxWidth: "165px", textAlign: "center" }}
              placeholder={t("experience.title")}
            />
          </Form.Item>
          <At />
          <Form.Item name={[field.name, "name"]} noStyle>
            <Input
              style={{
                maxWidth: "165px",
                textAlign: "center",
                borderLeftWidth: window.innerWidth >= 578 ? 0 : "1px"
              }}
              placeholder={t("experience.org")}
            />
          </Form.Item>
        </InputGroup>
        <Button
          onClick={() => remove(field.name)}
          shape="circle"
          icon={<DeleteOutlined />}
        />
      </div>
    );
  }
}

const AddNewExp = ({ add }: { add(): void }) => (
  <>
    <SmallMargin />
    <Form.Item>
      <Button onClick={add} shape="circle" icon={<PlusOutlined />} />
    </Form.Item>
    <br />
  </>
);

// tslint:disable-next-line:max-func-body-length
export function ExperienceForm(): JSX.Element | null {
  return (
    <>
      <Form.Item {...formItemLayout} label={t("field.blurb")} name="blurb">
        <TextArea autoSize={true} />
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        label={t("field.working_on")}
        name="workingOn"
      >
        <TextArea autoSize={true} />
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.desire")} name="desire">
        <TextArea autoSize={true} />
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.experience")}>
        <Form.List name="experience">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, index) => {
                  return (
                    <DeleteableExp key={index} field={field} remove={remove} />
                  );
                })}
                <AddNewExp add={add} />
              </>
            );
          }}
        </Form.List>
      </Form.Item>

      <Form.Item {...formItemLayout} label={t("field.education")}>
        <Form.List name="education">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((field, index) => {
                  return (
                    <DeleteableExp key={index} field={field} remove={remove} />
                  );
                })}
                <AddNewExp add={add} />
              </>
            );
          }}
        </Form.List>
      </Form.Item>
    </>
  );
}
