import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
import Rate from "antd/lib/rate";
import Tag from "antd/lib/tag";
import Typography from "antd/lib/typography";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import Select, { ActionMeta, components } from "react-select";
import { styled } from "styletron-react";
import { TTag, TTagTemplate } from "../../../types/tag";

const { Title } = Typography;

const CREATE_TAG = gql`
  mutation createTag($createTagInput: CreateTagInput!) {
    createTag(createTagInput: $createTagInput) {
      id
      ownerId
      rate
    }
  }
`;

const DELETE_TAG = gql`
  mutation deleteTag($deleteTagInput: DeleteTagInput!) {
    deleteTag(deleteTagInput: $deleteTagInput)
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

const ControlContainer = styled("div", {
  borderRadius: "1px solid black",
  padding: "5px"
});

const TagContainer = styled("div", {
  backgroundColor: "#fff"
});

const TagSpan = styled("span", {
  marginRight: "5px"
});

const OptionContainer = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff"
});

const MultiValueLabel = (props: any) => {
  const { data, selectProps } = props;
  return (
    <TagContainer>
      <Tag color="purple">
        <TagSpan>{data.value}</TagSpan>
        {data.hasRate && (
          <Rate
            value={data.rate}
            onChange={value => {
              selectProps
                .rateTag({
                  variables: {
                    rateTagInput: {
                      id: data.id,
                      rate: value
                    }
                  }
                })
                .then(() => {
                  selectProps.refetch();
                });
            }}
          />
        )}
      </Tag>
    </TagContainer>
  );
};

const Option = (props: any) => {
  return (
    <OptionContainer>
      <components.Option {...props}>
        <span>{props.children}</span>
        {props.isSelected && <Icon style={{ color: "#b46bd6" }} type="check" />}
      </components.Option>
    </OptionContainer>
  );
};

const MultiValueRemove = () => null;

const ClearIndicator = () => null;

const ControlComponent = (props: any) => (
  <ControlContainer>
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        flex: 1,
        justifyContent: "space-between"
      }}
    >
      <Title level={4}>{t("tags")}</Title>
      <Button
        type="primary"
        shape="circle"
        icon="plus"
        size="small"
        onClick={() => {
          props.selectProps.showModal();
        }}
      />
    </div>
    <components.Control {...props} />
  </ControlContainer>
);

type Props = {
  data: {
    getContactTags: Array<TTag>;
    getUserTagTemplates: Array<TTagTemplate>;
  };
  contactId: string;
  refetch(): void;
  showModal(): void;
};

export class SelectContainer extends React.Component<Props> {
  onChange = async (
    actionMeta: ActionMeta,
    createTag: MutationFn,
    deleteTag: MutationFn
  ) => {
    const { contactId } = this.props;
    const {
      action,
      // @ts-ignore
      removedValue,
      // @ts-ignore
      option
    } = actionMeta;
    let toRemoveId;
    switch (action) {
      // @ts-ignore
      case "pop-value":
      // @ts-ignore
      case "remove-value":
        toRemoveId = removedValue.id;
      case "deselect-option":
        const toRemoveItem = this.props.data.getContactTags.find(
          item => item.templateId === option.id
        );
        if (toRemoveItem) {
          toRemoveId = toRemoveItem.id;
        }
        if (!toRemoveId) {
          return;
        }
        await deleteTag({
          variables: {
            deleteTagInput: {
              id: toRemoveId
            }
          }
        });
        this.props.refetch();
        return;
      case "select-option":
        await createTag({
          variables: {
            createTagInput: {
              contactId,
              templateId: option.id,
              rate: 5
            }
          }
        });
        this.props.refetch();
        return;
      case "clear":
      default:
    }
  };

  render(): JSX.Element {
    const { getContactTags, getUserTagTemplates } = this.props.data;

    const options = getUserTagTemplates.map(item => ({
      ...item,
      value: item.name,
      label: item.name
    }));
    const values = getContactTags.map(item => ({
      ...item,
      value: item.name,
      label: item.name
    }));

    return (
      <Mutation mutation={UPDATE_TAG}>
        {(rateTag: MutationFn) => (
          <Mutation mutation={DELETE_TAG}>
            {(deleteTag: MutationFn) => (
              <Mutation mutation={CREATE_TAG}>
                {(createTag: MutationFn) => (
                  <Select
                    placeholder={t("tag.select.placeholder")}
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                    styles={{
                      option: base => {
                        return {
                          ...base,
                          height: "100%",
                          color: "#333",
                          backgroundColor: "#fff",
                          flex: 1,
                          display: "flex",
                          justifyContent: "space-between"
                        };
                      }
                    }}
                    theme={theme => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: "#b46bd6"
                      }
                    })}
                    value={values}
                    components={{
                      MultiValueLabel,
                      MultiValueRemove,
                      ClearIndicator,
                      Control: ControlComponent,
                      Option
                    }}
                    isMulti
                    options={options}
                    onChange={(_, action) => {
                      this.onChange(action, createTag, deleteTag);
                    }}
                    showModal={this.props.showModal}
                    rateTag={rateTag}
                    refetch={this.props.refetch}
                  />
                )}
              </Mutation>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}
