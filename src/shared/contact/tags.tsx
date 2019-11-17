import { Rate, Select } from "antd";
import { styled } from "onefx/lib/styletron-react";
import React from "react";

const { Option } = Select;

const Container = styled("div", {
  width: "100%",
  marginBottom: "20px"
});

export class Tags extends React.Component {
  handleChange = (value: string) => {
    window.console.log(`selected ${value}`);
  };

  handleRateChange = (key: string, value: number) => {
    window.console.log(key, value);
  };

  render(): JSX.Element {
    const children = [];
    for (let i = 10; i < 36; i++) {
      const key = i.toString(36) + i;
      children.push(
        <Option key={key}>
          <div className="option-wrap">
            {i.toString(36) + i}
            <Rate
              character="★"
              style={{ fontSize: 14, margin: 0 }}
              onChange={value => {
                this.handleRateChange(key, value);
              }}
            />
          </div>
        </Option>
      );
    }

    return (
      <Container>
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Tags Mode"
          onChange={this.handleChange}
        >
          {children}
        </Select>
      </Container>
    );
  }
}
