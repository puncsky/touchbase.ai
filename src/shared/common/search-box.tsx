import { SearchOutlined } from "@ant-design/icons";
import AutoComplete from "antd/lib/auto-complete";
import Input from "antd/lib/input";
import gql from "graphql-tag";
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { RouterProps, withRouter } from "react-router";
import { apolloClient } from "./apollo-client";
import { loadScript } from "./load-script";

const { Option } = AutoComplete;

const SEARCH = gql`
  query search($name: String!, $hmacs: [String!]) {
    search(name: $name, hmacs: $hmacs) {
      name
      path
    }
  }
`;

type ISearchResult = {
  name: string;
  path: string;
};

type State = {
  searchResults: Array<ISearchResult>;
};

type Props = RouterProps;

export const SearchBox = withRouter(
  // @ts-ignore
  class SearchBoxInner extends Component<Props> {
    public state: State = {
      searchResults: []
    };

    private listener: any;

    public handleSearch = async (inputText: string) => {
      const { data } = await apolloClient.query<{
        search: Array<ISearchResult>;
      }>({
        variables: {
          name: inputText
        },
        query: SEARCH
      });
      this.setState({ searchResults: data.search });
    };

    public handleSelect = (value: any) => {
      this.props.history.push(value);
    };

    public inputRef: any;

    private readonly focus = () => {
      this.inputRef.focus();
    };

    public componentDidMount(): void {
      loadScript(assetURL("./keypress-2.1.5.min.js"), () => {
        // @ts-ignore
        this.listener = new window.keypress.Listener();
        this.listener.simple_combo(
          "cmd e",
          () => {
            this.focus();
          },
          true
        );
      });
    }

    public componentWillUnmount(): void {
      if (this.listener) {
        this.listener.reset();
      }
    }

    public render(): JSX.Element {
      const { searchResults } = this.state;
      const children = searchResults.map(res => (
        <Option key={res.path} value={res.path}>
          {res.name}
        </Option>
      ));
      return (
        <div
          className="certain-category-search-wrapper"
          style={{ marginRight: "14px" }}
        >
          <AutoComplete
            className="certain-category-search"
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 300 }}
            size="large"
            style={{ width: "100%" }}
            // @ts-ignore
            dataSource={children}
            placeholder={t("topbar.search_everything")}
            onSearch={this.handleSearch}
            onSelect={this.handleSelect}
          >
            <Input
              ref={ref => (this.inputRef = ref)}
              suffix={<SearchOutlined className="certain-category-icon" />}
            />
          </AutoComplete>
        </div>
      );
    }
  }
);
