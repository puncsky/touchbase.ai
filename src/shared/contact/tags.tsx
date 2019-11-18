import {
  Checkbox,
  Divider,
  Form,
  Icon,
  Input,
  Modal,
  Rate,
  Select
} from "antd";
import { FormProps, WrappedFormUtils } from "antd/lib/form/Form";
import gql from "graphql-tag";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import Mutation, { MutationFn } from "react-apollo/Mutation";
import { TTag, TTagTemplate } from "../../types/tag";

const { Option } = Select;

const Container = styled("div", {
  width: "100%",
  marginBottom: "20px"
});

type State = {
  modalShow: boolean;
};

type Props = {
  contactId: string;
} & FormProps;

const CREATE_TAG = gql`
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

const QUERY_TEMPLATES = gql`
  query getUserTagTemplates($contactId: String!) {
    getUserTagTemplates {
      id
      name
      hasRate
    }
    getContactTags(contactId: $contactId) {
      id
      name
      templateId
      hasRate
      rate
      contactId
      ownerId
    }
  }
`;

class Tags extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalShow: false
    };
  }

  handleChange = (value: string) => {
    window.console.log(`selected ${value}`);
  };

  handleRateChange = (key: string, value: number) => {
    window.console.log(key, value);
  };

  showModal = () => {
    this.setState({
      modalShow: true
    });
  };

  createTag = (createTag: MutationFn) => {
    const { form } = this.props;
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
      } catch (e) {
        window.console.log(e.graphQLErrors);
      }
    });
  };

  hideModal = () => {
    this.setState({
      modalShow: false
    });
  };

  render(): JSX.Element {
    // @ts-ignore
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    return (
      <Container>
        <Query
          query={QUERY_TEMPLATES}
          variables={{ contactId: this.props.contactId }}
        >
          {({
            loading,
            data
          }: QueryResult<{
            getUserTagTemplates: Array<TTagTemplate>;
            getContactTags: Array<TTag>;
          }>) => {
            if (loading) {
              return <div />;
            }
            if (!data) {
              return <div />;
            }
            return (
              <>
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Tags Mode"
                  onChange={this.handleChange}
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      <Divider style={{ margin: "4px 0" }} />
                      {/* tslint:disable-next-line:react-a11y-event-has-role */}
                      <div
                        style={{ padding: "4px 8px", cursor: "pointer" }}
                        onMouseDown={e => e.preventDefault()}
                        onClick={this.showModal}
                      >
                        <Icon type="plus" /> Add item
                      </div>
                    </div>
                  )}
                >
                  {data.getUserTagTemplates.map((item: TTagTemplate) => (
                    <Option key={item.id}>
                      <div className="option-wrap">
                        {item.name}
                        <Rate
                          character="★"
                          style={{ fontSize: 14, margin: 0 }}
                        />
                      </div>
                    </Option>
                  ))}
                </Select>
                <Mutation mutation={CREATE_TAG}>
                  {(createTag: MutationFn) => (
                    <Modal
                      title="Basic Modal"
                      visible={this.state.modalShow}
                      onOk={() => {
                        this.createTag(createTag);
                      }}
                      onCancel={this.hideModal}
                    >
                      <Form layout="vertical">
                        <Form.Item label="Tag Name">
                          {getFieldDecorator("name", {
                            rules: [
                              {
                                required: true,
                                message: "Please input tag name"
                              }
                            ]
                          })(
                            <Input
                              prefix={
                                <Icon
                                  type="tag"
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
                              placeholder="name"
                            />
                          )}
                        </Form.Item>
                        <Form.Item>
                          {getFieldDecorator("hasRate", {
                            valuePropName: "checked",
                            initialValue: false
                          })(<Checkbox>Need Rate</Checkbox>)}
                        </Form.Item>
                      </Form>
                    </Modal>
                  )}
                </Mutation>
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
