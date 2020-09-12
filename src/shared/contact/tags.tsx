import { PlusOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Dropdown,
  Input,
  Menu,
  Modal,
  Rate,
  Tag
} from "antd";
import Divider from "antd/lib/divider";
import { ApolloQueryResult } from "apollo-client";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Mutation, { MutationFn } from "react-apollo/Mutation";
import { TTag, TTagTemplate } from "../../types/tag";
import { Flex } from "../common/flex";
import { Preloader } from "../common/preloader";

const Container = styled("div", {
  width: "100%",
  marginBottom: "20px"
});

const TagWrapper = styled("div", {
  padding: "5px"
});

type State = {
  modalShow: boolean;
  showInput: boolean;
  dataSource: Array<string>;
  inputValue: string;
  selectedTag: TTag | null;
};

type RefetchTagType = () => Promise<
  ApolloQueryResult<{
    getUserTagTemplates: [TTagTemplate];
    getContactTags: [TTag];
  }>
>;

type Props = {
  contactId: string;
};

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

const UPDATE_TAG = gql`
  mutation rateTag($rateTagInput: RateTagInput!) {
    rateTag(rateTagInput: $rateTagInput) {
      id
      rate
    }
  }
`;

const DELETE_TAG = gql`
  mutation deleteTag($deleteTagInput: DeleteTagInput!) {
    deleteTag(deleteTagInput: $deleteTagInput)
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
  constructor(props: Props) {
    super(props);
    this.state = {
      modalShow: false,
      showInput: false,
      inputValue: "",
      dataSource: [],
      selectedTag: null
    };
  }

  showInput = () => {
    this.setState({ showInput: true });
  };

  onSelect = async (
    createTag: MutationFn,
    value: string,
    unselected: Array<TTagTemplate>,
    refetch: RefetchTagType
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
          rate: 0
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
    refetch: RefetchTagType
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
          rate: 0
        }
      }
    });

    await refetch();
    this.onInputBlur();
  };

  updateRate = async (
    updateTag: MutationFn,
    tag: TTag,
    value: number,
    refetch: RefetchTagType
  ) => {
    await updateTag({
      variables: {
        rateTagInput: {
          id: tag.id,
          rate: value
        }
      }
    });
    await refetch();
  };

  deleteTag = (deleteTag: MutationFn, tag: TTag, refetch: RefetchTagType) => {
    Modal.confirm({
      title: t("tag.delete_confirm"),
      okType: "danger",
      okText: t("tag.delete_confirm.ok"),
      cancelText: t("tag.delete_confirm.cancel"),
      onCancel: () => {
        this.clearSelectedTag();
      },
      onOk: async () => {
        await deleteTag({
          variables: {
            deleteTagInput: {
              id: tag.id
            }
          }
        });
        await refetch();
        this.clearSelectedTag();
      }
    });
  };

  clearSelectedTag = () => {
    this.setState({
      selectedTag: null
    });
  };

  render(): JSX.Element {
    return (
      <Container>
        <Mutation mutation={DELETE_TAG}>
          {(deleteTagFn: MutationFn) => (
            <Mutation mutation={UPDATE_TAG}>
              {(updateTag: MutationFn) =>
                this.renderQuery(deleteTagFn, updateTag)
              }
            </Mutation>
          )}
        </Mutation>
      </Container>
    );
  }

  renderQuery = (deleteTagFn: MutationFn, updateTag: MutationFn) => {
    return (
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
                {data.getContactTags.map(item =>
                  this.renderTag(deleteTagFn, updateTag, item, refetch)
                )}
                {this.renderInput(unselectedTemplates, refetch)}
              </Flex>
              <Divider />
            </>
          );
        }}
      </Query>
    );
  };

  renderTag = (
    deleteTagFn: MutationFn,
    updateTag: MutationFn,
    item: TTag,
    refetch: RefetchTagType
  ) => {
    const menu = (
      <Menu>
        <Menu.Item>
          <Rate
            allowClear
            value={item.rate}
            onChange={value => {
              this.updateRate(updateTag, item, value, refetch);
            }}
          />
        </Menu.Item>
        <Menu.Item>
          <Button
            danger
            ghost
            onClick={() => {
              this.setState({
                modalShow: true,
                selectedTag: item
              });
              this.deleteTag(deleteTagFn, item, refetch);
            }}
          >
            {t("tag.delete")}
          </Button>
        </Menu.Item>
      </Menu>
    );
    return (
      <TagWrapper key={item.id}>
        <Dropdown overlay={menu}>
          <Tag>
            {`${item.name}${item.rate > 0 ? " | " : ""}`}
            {item.rate > 0 &&
              Array.from({
                length: 5
              }).map((_, index) =>
                index < item.rate ? (
                  <StarFilled key={`tag${index}`} />
                ) : (
                  <StarOutlined key={`tag${index}`} />
                )
              )}
          </Tag>
        </Dropdown>
      </TagWrapper>
    );
  };

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
                        value,
                        unselectedTemplates,
                        refetch
                      );
                    }}
                    placeholder={t("tag.create_tag")}
                    onBlur={this.onInputBlur}
                    onChange={value => {
                      this.onChange(value, unselectedTemplates);
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
              padding: "5px",
              cursor: "pointer"
            }}
          >
            <PlusOutlined />
            {t("tag.add_tag")}
          </Tag>
        )}
      </>
    );
  };
}

export const TagsContainer = Tags;
