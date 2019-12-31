import { Input, Select } from "antd";
import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { styled } from "styletron-react";
import countryData from "./countries.json";
import {
  formatNumber,
  formatToE164,
  getCallingCode,
  guessCountry
} from "./util";

const Option = Select.Option;

const OptionContent = styled("div", {
  padding: "5px 12px",
  margin: "-5px -12px",
  display: "flex",
  alignItems: "center"
});

const CountryName = styled("span", {
  fontWeight: 500,
  margin: "0 0.2em"
});

const DropdownWrap = styled("div", {
  width: "301px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
});

type PassingParam = {
  value: string;
  callingCode: string;
};

interface DialCodeSelectProps {
  iso2: string;
  onChange(value: string): void;
}

class DialCodeSelect extends React.Component<DialCodeSelectProps> {
  state: { open: boolean } = { open: false };
  render(): JSX.Element {
    return (
      <>
        <Helmet>
          <style>
            {`
          .ant-select-selection-selected-value .option-content * {
            display: none;
          }
          .ant-select-selection-selected-value .option-content > :first-child {
            display: initial;
          }
          `}
          </style>
        </Helmet>
        <Select
          style={{ minWidth: 64 }}
          value={this.props.iso2}
          onChange={this.props.onChange}
          onDropdownVisibleChange={open => this.setState({ open })}
          dropdownRender={menu => <DropdownWrap>{menu}</DropdownWrap>}
          dropdownMenuStyle={{ padding: 0, background: "white" }}
          showSearch
          filterOption
          optionFilterProp="title"
        >
          {(countryData as Array<Array<string>>).map(
            ([name, dialCode, flag, iso2]) => (
              <Option
                title={`${name} +${dialCode}`}
                value={iso2}
                key={iso2 + dialCode}
              >
                <OptionContent className="option-content">
                  {<span>{flag}</span>}
                  <CountryName>{name}</CountryName>
                  <span>(+{dialCode})</span>
                </OptionContent>
              </Option>
            )
          )}
        </Select>
      </>
    );
  }
}

interface PhoneInputProps {
  locale: string;
  value?: string;
  onChange?(v: PassingParam): void;
  onBlur?(v: any): void;
  style?: React.CSSProperties;
}

interface PhoneInputState {
  iso2: string;
  value: string;
}

class PhoneInput extends React.Component<PhoneInputProps, PhoneInputState> {
  defaultCountry: string;
  constructor(props: PhoneInputProps) {
    super(props);
    let value = "";
    let iso2 = "";
    // The `locale` en in base store is `lang`, not really `locale`(e.g. en_US).
    this.defaultCountry = props.locale === "zh" ? "CN" : "US";

    if (props.value) {
      const countryInfo = guessCountry(props.value);
      iso2 = countryInfo.iso2;
      value = formatNumber(props.value, countryInfo.format);
    }
    if (!iso2 && !value) {
      iso2 = this.defaultCountry;
      value = `+${getCallingCode(iso2)}`;
    }
    this.state = { iso2, value };
  }

  onChangeInput = (newVal: string, inputEl: HTMLInputElement) => {
    const { onChange } = this.props;
    const countryInfo = guessCountry(newVal);
    const phoneNumber = formatNumber(newVal, countryInfo.format);
    this.setState(
      {
        value: phoneNumber,
        iso2: countryInfo.iso2 || this.state.iso2
      },
      () => {
        const lastIndex = phoneNumber.length - 1;
        const lastChar = phoneNumber[lastIndex];

        if (lastChar === ")") {
          inputEl.setSelectionRange(lastIndex, lastIndex);
        }
      }
    );
    if (onChange) {
      onChange({
        value: phoneNumber,
        callingCode: countryInfo.callingCode
      });
      // onChange(formatToE164(newVal));
    }
  };

  onChangeSelect = (newIso2: string) => {
    const { onChange } = this.props;
    const formatVal = this.state.value;
    const newCallingCode = getCallingCode(newIso2);
    const countryInfo = guessCountry(formatVal);

    if (countryInfo.iso2) {
      const newFormatVal = formatVal.replace(
        countryInfo.callingCode,
        newCallingCode
      );
      const newCountryInfo = guessCountry(newFormatVal);
      const newValue = formatNumber(newFormatVal, newCountryInfo.format);
      this.setState({
        value: newValue,
        iso2: newIso2
      });
      if (onChange) {
        onChange({
          value: newValue,
          callingCode: newCallingCode
        });
      }
    } else {
      this.setState({
        value: `+${newCallingCode}`,
        iso2: newIso2
      });
      if (onChange) {
        onChange({
          value: `+${newCallingCode}`,
          callingCode: newCallingCode
        });
      }
    }
  };

  render(): JSX.Element {
    return (
      <Input
        style={this.props.style}
        value={this.state.value}
        onChange={event => {
          this.onChangeInput(event.target.value, event.target);
        }}
        onBlur={({ target }) => {
          if (this.props.onBlur) {
            this.props.onBlur({
              target: { value: formatToE164(target.value) }
            });
          }
        }}
        addonBefore={
          <DialCodeSelect
            iso2={this.state.iso2}
            onChange={iso2 => {
              this.onChangeSelect(iso2);
            }}
          />
        }
      />
    );
  }
}

export default connect((state: { base: { locale: string } }) => ({
  locale: state.base.locale
}))(PhoneInput);
