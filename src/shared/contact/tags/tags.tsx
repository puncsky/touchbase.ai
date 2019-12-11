import {
  Checkbox,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Modal,
  Rate,
  Tag,
  AutoComplete
} from "antd";
import Divider from "antd/lib/divider";
import { FormProps, WrappedFormUtils } from "antd/lib/form/Form";
import notification from "antd/lib/notification";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Mutation, { MutationFn } from "react-apollo/Mutation";
import { TTag, TTagTemplate } from "../../../types/tag";
import { Flex } from "../../common/flex";
import { Preloader } from "../../common/preloader";
import { SelectContainer } from "./select";

const Container = styled("div", {
  width: "100%",
  marginBottom: "20px"
});

type State = {
  modalShow: boolean;
  showInput: boolean;
  inputValue: string;
  dataSource: Array<string>;
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

  showModal = () => {
    this.setState({
      modalShow: true
    });
  };

  createTag = (createTag: MutationFn, refetch: () => void) => {
    const { form } = this.props;
    const { resetFields } = form;
    if (!form) {
      return;
    }
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      try {
        await createTag({
          variables: {
            createTagTemplateInput: {
              ...values
            }
          }
        });
        this.hideModal();
        notification.success({
          message: t("tag.create_success")
        });
        resetFields();
        refetch();
      } catch (e) {
        notification.error({
          message: t("tag.create_error"),
          description: e
        });
      }
    });
  };

  hideModal = () => {
    this.setState({
      modalShow: false
    });
  };

  showInput = () => {
    this.setState({ showInput: true });
  };
  onSelect = (createTag: MutationFn, value: any) => {};

  onSearch = (
    createTemplateTag: MutationFn,
    createTag: MutationFn,
    searchText: string
  ) => {};

  onChange = (value: string) => {};

  saveInputRef = (input: Input) => (this.input = input);

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
            return (
              <>
                <SelectContainer
                  contactId={this.props.contactId}
                  refetch={refetch}
                  data={data}
                  showModal={() => {
                    this.showModal();
                  }}
                />
                <Divider />
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
                      <div key={item.id}>
                        <Dropdown overlay={menu}>
                          <Tag>{item.name}</Tag>
                        </Dropdown>
                      </div>
                    );
                  })}
                  {this.state.showInput && (
                    <Mutation mutation={CREATE_TAG}>
                      {(createTag: MutationFn) => (
                        <Mutation mutation={CREATE_TEMPLATE_TAG}>
                          {(createTemplateTag: MutationFn) => (
                            <AutoComplete
                              autoFocus
                              dataSource={this.state.dataSource}
                              style={{ width: 200 }}
                              onSelect={value =>
                                this.onSelect(createTag, value)
                              }
                              onSearch={(value: string) =>
                                this.onSearch(
                                  createTemplateTag,
                                  createTag,
                                  value
                                )
                              }
                              placeholder="input here"
                            />
                          )}
                        </Mutation>
                      )}
                    </Mutation>
                  )}
                  {!this.state.showInput && (
                    <Tag
                      onClick={this.showInput}
                      style={{ background: "#fff", borderStyle: "dashed" }}
                    >
                      <Icon type="plus" /> New Tag
                    </Tag>
                  )}
                </Flex>
                <Divider />
              </>
            );
          }}
        </Query>
      </Container>
    );
  }
}

export const TagsContainer = Form.create<Props & { form: WrappedFormUtils }>({
  name: "createTagForm"
})(Tags);
