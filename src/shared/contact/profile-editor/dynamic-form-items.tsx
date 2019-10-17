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

class DynamicFormItems extends React.Component<
  {
    renderItem(key: number, index: number): React.ReactNode;
    itemSize: number;
    label: string;
  },
  { fieldKeys: Array<number> }
> {
  fieldId: number = 0;
  constructor(props: any) {
    super(props);
    this.state = {
      fieldKeys: Array.from({ length: props.itemSize }).map(
        () => this.fieldId++
      )
    };
  }
  addField = () => {
    this.setState({
      fieldKeys: this.state.fieldKeys.concat(this.fieldId++)
    });
  };
  removeField = (key: number) => {
    this.setState({
      fieldKeys: this.state.fieldKeys.filter(k => k !== key)
    });
  };
  render(): JSX.Element {
    const { label, renderItem } = this.props;
    return (
      <>
        {this.state.fieldKeys.map((key, i) => (
          <Form.Item
            key={key}
            style={{ marginBottom: 4 }}
            {...(i === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={i === 0 && label}
          >
            <ItemChildrenContainer $isSingle={this.state.fieldKeys.length < 2}>
              {renderItem(key, i)}
            </ItemChildrenContainer>
            {this.state.fieldKeys.length > 1 && (
              <Button
                shape="circle"
                icon="delete"
                onClick={() => this.removeField(key)}
              />
            )}
          </Form.Item>
        ))}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button shape="circle" icon="plus" onClick={this.addField} />
        </Form.Item>
      </>
    );
  }
}

export default DynamicFormItems;
