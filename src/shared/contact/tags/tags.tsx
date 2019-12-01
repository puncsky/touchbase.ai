import { Checkbox, Form, Icon, Input, Modal } from "antd";
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
import { Preloader } from "../../common/preloader";
import { SelectContainer } from "./select";

const Container = styled("div", {
  width: "100%",
  marginBottom: "20px"
});

type State = {
  modalShow: boolean;
};

type Props = {
  contactId: string;
  form: WrappedFormUtils;
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
      modalShow: false
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

  render(): JSX.Element {
    const { getFieldDecorator } = this.props.form;

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
                <Mutation mutation={CREATE_TAG}>
                  {(
                    createTag: MutationFn,
                    { loading }: { loading: boolean }
                  ) => (
                    <Modal
                      title={t("tag.create_tag")}
                      visible={this.state.modalShow}
                      onOk={() => {
                        this.createTag(createTag, refetch);
                      }}
                      onCancel={this.hideModal}
                      confirmLoading={loading}
                    >
                      <Form layout="vertical">
                        <Form.Item label={t("tag.name")}>
                          {getFieldDecorator("name", {
                            rules: [
                              {
                                required: true,
                                message: t("tag.name_required")
                              }
                            ]
                          })(
                            <Input
                              prefix={
                                <Icon
                                  type="tag"
                                  style={{ color: "rgba(0,0,0,0.25)" }}
                                />
                              }
                              placeholder={t("tag.name")}
                            />
                          )}
                        </Form.Item>
                        <Form.Item>
                          {getFieldDecorator("hasRate", {
                            valuePropName: "checked",
                            initialValue: false
                          })(<Checkbox>{t("tag.rate_required")}</Checkbox>)}
                        </Form.Item>
                      </Form>
                    </Modal>
                  )}
                </Mutation>
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
