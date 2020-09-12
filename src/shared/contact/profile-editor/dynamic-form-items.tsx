import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import React from "react";
import { styled } from "styletron-react";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  },
  colon: false
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 18, offset: 6 }
  }
};

const ItemChildrenContainer = styled(
  "span",
  (props: { $isSingle: boolean }) => ({
    width: props.$isSingle ? "100%" : "calc(100% - 40px)",
    marginRight: props.$isSingle ? 0 : "8px",
    display: "inline-block"
  })
);

class DynamicFormItems extends React.Component<{
  renderItem(value: any): React.ReactNode;
  label: string;
  name: string;
}> {
  render(): JSX.Element {
    const { label, renderItem, name } = this.props;
    return (
      <Form.List name={name}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={index}
                  style={{ marginBottom: 4 }}
                  {...(index === 0
                    ? formItemLayout
                    : formItemLayoutWithOutLabel)}
                  label={index === 0 && label}
                >
                  <ItemChildrenContainer $isSingle={fields.length < 2}>
                    {renderItem(field)}
                  </ItemChildrenContainer>

                  {fields.length > 1 && (
                    <Button
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(field.name)}
                    />
                  )}
                </Form.Item>
              ))}
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button shape="circle" icon={<PlusOutlined />} onClick={add} />
              </Form.Item>
            </>
          );
        }}
      </Form.List>
    );
  }
}

export default DynamicFormItems;
