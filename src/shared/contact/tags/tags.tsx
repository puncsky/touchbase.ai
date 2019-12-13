import {
  AutoComplete,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Rate,
  Tag
} from "antd";
import Divider from "antd/lib/divider";
import { FormProps, WrappedFormUtils } from "antd/lib/form/Form";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Mutation, { MutationFn } from "react-apollo/Mutation";
import { TTag, TTagTemplate } from "../../../types/tag";
import { Flex } from "../../common/flex";
import { Preloader } from "../../common/preloader";

const Container = styled("div", {
  width: "100%",
  marginBottom: "20px"
});

type State = {
  modalShow: boolean;
  showInput: boolean;
  dataSource: Array<string>;
  inputValue: string;
};

type Props = {
  contactId: string;
  form: WrappedFormUtils;
} & FormProps;

const CREATE_TEMPLATE_TAG = gql`
  mutation createTagTemplateInput(
    $createTagTemplateInput: CreateTagTemplateInput!
  ) {
    createTagTemplate(createTagTemplateInput: $createTagTemplateInput) {
      id
      name
      ownerId
      hasRate
    }
  }
`;

const CREATE_TAG = gql`
  mutation createTag($createTagInput: CreateTagInput!) {
    createTag(createTagInput: $createTagInput) {
      id
      ownerId
      rate
    }
  }
`;

const QUERY_TEMPLATES = gql`
  query getUserTagTemplates($contactId: String!) {
    getUserTagTemplates {
      id
      name
      hasRate
    }
    getContactTags(contactId: $contactId) {
      id
      templateId
      rate
      contactId
      hasRate
      name
    }
  }
`;

function TagSpin(): JSX.Element {
  return <Preloader />;
}

class Tags extends React.Component<Props, State> {
  // private input: Input;
  constructor(props: Props) {
    super(props);
    this.state = {
      modalShow: false,
      showInput: false,
      inputValue: "",
      dataSource: []
    };
  }

  showInput = () => {
    this.setState({ showInput: true });
  };

  onSelect = async (
    createTag: MutationFn,
    value: string,
    unselected: Array<TTagTemplate>,
    refetch: any
  ) => {
    const template = unselected.find(item => item.name === value);
    if (!template) {
      return;
    }
    await createTag({
      variables: {
        createTagInput: {
          templateId: template.id,
          contactId: this.props.contactId,
          rate: 5
        }
      }
    });
    await refetch();
    this.onInputBlur();
  };

  onInputBlur = () => {
    this.setState({
      showInput: false,
      inputValue: ""
    });
  };

  onChange = (value: string, data: Array<TTagTemplate>) => {
    this.setState({
      inputValue: value
    });
    let dataSource: Array<string>;
    if (value === "") {
      dataSource = data.map(item => item.name);
    } else {
      dataSource = data
        .filter(item =>
          item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
        )
        .map(item => item.name);
    }
    this.setState({
      dataSource: dataSource
    });
  };

  createTemplateAndTag = async (
    createTemplateTag: MutationFn,
    createTag: MutationFn,
    refetch: any
  ) => {
    const template = (await createTemplateTag({
      variables: {
        createTagTemplateInput: {
          name: this.state.inputValue,
          hasRate: true
        }
      }
    })) as any;

    await createTag({
      variables: {
        createTagInput: {
          templateId: template.data.createTagTemplate.id,
          contactId: this.props.contactId,
          rate: 5
        }
      }
    });

    await refetch();
    this.onInputBlur();
  };

  render(): JSX.Element {
    return (
      <Container>
        <Query
          query={QUERY_TEMPLATES}
          variables={{ contactId: this.props.contactId }}
        >
          {({
            loading,
            data,
            refetch
          }: QueryResult<{
            getUserTagTemplates: [TTagTemplate];
            getContactTags: [TTag];
          }>) => {
            if (loading || !data) {
              return <TagSpin />;
            }
            const unselectedTemplates = data.getUserTagTemplates.filter(
              template =>
                data.getContactTags.findIndex(
                  tag => tag.templateId === template.id
                ) === -1
            );
            return (
              <>
                <Flex
                  flexDirection="row"
                  alignContent="flex-start"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  {data.getContactTags.map(item => {
                    const menu = (
                      <Menu>
                        <Menu.Item>
                          <Rate value={item.rate} />
                        </Menu.Item>
                      </Menu>
                    );
                    return (
                      <div key={item.id} style={{ padding: "5px" }}>
                        <Dropdown overlay={menu}>
                          <Tag>{item.name}</Tag>
                        </Dropdown>
                      </div>
                    );
                  })}
                  {this.renderInput(unselectedTemplates, refetch)}
                </Flex>
                <Divider />
              </>
            );
          }}
        </Query>
      </Container>
    );
  }

  renderInput = (unselectedTemplates: Array<TTagTemplate>, refetch: any) => {
    const { inputValue, dataSource } = this.state;
    return (
      <>
        {this.state.showInput && (
          <Mutation mutation={CREATE_TAG}>
            {(createTag: MutationFn) => (
              <Mutation mutation={CREATE_TEMPLATE_TAG}>
                {(createTemplateTag: MutationFn) => (
                  <AutoComplete
                    value={inputValue}
                    autoFocus
                    defaultOpen
                    dataSource={
                      inputValue !== ""
                        ? dataSource
                        : unselectedTemplates.map(item => item.name)
                    }
                    style={{ width: 150 }}
                    onSelect={value => {
                      this.onSelect(
                        createTag,
                        value as string,
                        unselectedTemplates,
                        refetch
                      );
                    }}
                    placeholder={t("tag.create_tag")}
                    onBlur={this.onInputBlur}
                    onChange={value => {
                      this.onChange(value as string, unselectedTemplates);
                    }}
                  >
                    <Input
                      onPressEnter={() => {
                        this.createTemplateAndTag(
                          createTemplateTag,
                          createTag,
                          refetch
                        );
                      }}
                    />
                  </AutoComplete>
                )}
              </Mutation>
            )}
          </Mutation>
        )}
        {!this.state.showInput && (
          <Tag
            onClick={this.showInput}
            style={{
              background: "#fff",
              borderStyle: "dashed",
              padding: "5px"
            }}
          >
            <Icon type="plus" />
            {t("tag.add_tag")}
          </Tag>
        )}
      </>
    );
  };
}

export const TagsContainer = Form.create<Props & { form: WrappedFormUtils }>({
  name: "createTagForm"
})(Tags);
