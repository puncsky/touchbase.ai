import DatePicker from "antd/lib/date-picker";
import Form from "antd/lib/form";
import Modal from "antd/lib/modal";
import { FormInstance } from "antd/lib/form/Form";
import Switch from "antd/lib/switch";
import Editor from "rich-markdown-editor";
import ObjectID from "bson-objectid";
import styled from "styled-components";
import moment from "moment";
import { t } from "onefx/lib/iso-i18n";
import { Helmet } from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { connect } from "react-redux";
import { TContact2 } from "../../../types/human";
import { debounce } from "./util";
import { TOP_BAR_HEIGHT } from "../../common/top-bar";
import { actionUpsertEvent as upsertEvent } from "../human-reducer";

type Props = {
  // container
  actionUpsertEvent(payload: any, contactId: string, isSelf: boolean): void;
  ownerHumanId: string;
  humanId: string;

  // external
  initialValue: string;
  eventId: string;
  children: any;
  timestamp?: Date;
  public?: boolean;
};

type State = {
  isVisible: boolean;
  public?: boolean;
  content: string;
  id: string;
  _isFocus: boolean;
};

const EditorWrapper = styled.div`
  padding: 8px 3em;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: scroll;
  height: 50vh;
  transition: border-color 0.3s;

  &.focus {
    border-color: #cd96e3;
    box-shadow: 0 0 0 2px #cd96e3;
  }
`;

export const UpsertEventContainer = connect(
  (state: { base: { ownerHumanId: string }; human: TContact2 }) => ({
    ownerHumanId: state.base.ownerHumanId
  }),
  (dispatch: any) => ({
    actionUpsertEvent: (payload: any, contactId: string, isSelf: boolean) =>
      dispatch(upsertEvent(payload, contactId, isSelf))
  })
)(
  // @ts-ignore
  class Edit extends Component<Props, State> {
    public props: Props;

    public state: State = {
      isVisible: false,
      public: false,
      content: "",
      _isFocus: false,
      id: ""
    };

    editorRef: any = React.createRef<any>();

    formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    constructor(props: Props) {
      super(props);
      this.state.public = props.public;
    }

    handleEditorChange = debounce(value => {
      const text = value();
      localStorage.setItem("event-editor", text);
      return text;
    });

    // tslint:disable-next-line: max-func-body-length
    public render(): JSX.Element | null {
      const {
        actionUpsertEvent,
        ownerHumanId,
        humanId,
        initialValue,
        eventId,
        children,
        timestamp
      } = this.props;
      const isPublic = this.state.public;
      return (
        <div>
          <Helmet>
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css"
            />
          </Helmet>
          <Modal
            visible={this.state.isVisible}
            style={{ top: TOP_BAR_HEIGHT }}
            title={eventId ? t("edit_event") : t("add_event")}
            onCancel={() => {
              this.setState({
                isVisible: false,
                content: !initialValue ? "" : this.state?.content
              });
            }}
            onOk={() => {
              if (!this.formRef.current) {
                return;
              }
              this.setState(
                {
                  content: localStorage.getItem("event-editor") || ""
                },
                () => {
                  this.formRef.current
                    ?.validateFields()
                    .then(values => {
                      actionUpsertEvent(
                        {
                          id: eventId || String(this.state.id),
                          content: this.state.content,
                          relatedHumans: [ownerHumanId, humanId],
                          public: this.state.public,
                          timestamp:
                            (values.timestamp && values.timestamp.toDate()) ||
                            new Date()
                        },
                        humanId,
                        ownerHumanId === humanId
                      );
                      if (!initialValue) {
                        this.setState({
                          content: ""
                        });
                      }
                      this.setState({ isVisible: false });
                    })
                    .catch(({ errorFields }) => {
                      if (this.formRef.current) {
                        this.formRef.current.scrollToField(errorFields[0].name);
                      }
                    });
                }
              );
            }}
            destroyOnClose
          >
            <Form
              initialValues={{
                timestamp: moment(timestamp || new Date()),
                public: isPublic
              }}
              ref={this.formRef}
            >
              <Form.Item name="timestamp">
                <DatePicker showTime allowClear={false} />
              </Form.Item>
              <EditorWrapper
                className={this.state._isFocus ? "focus" : ""}
                onClick={() => {
                  if (this.editorRef && !this.state._isFocus) {
                    this.editorRef.current.focusAtEnd();
                  }
                }}
              >
                <Editor
                  ref={this.editorRef}
                  defaultValue={initialValue}
                  value={this.state.content}
                  onChange={this.handleEditorChange}
                  handleDOMEvents={{
                    focus: (_views, _event) => {
                      this.setState({
                        _isFocus: true
                      });
                      return true;
                    },
                    blur: (_views, _event) => {
                      this.setState({
                        _isFocus: false
                      });
                      return true;
                    }
                  }}
                  theme={
                    {
                      zIndex: 1001,
                      blockToolbarBackground: "white"
                    } as any
                  }
                />
              </EditorWrapper>
              <Form.Item label={t("make_public")}>
                <Form.Item name="public">
                  <Switch
                    onChange={v =>
                      this.setState({
                        public: v,
                        id: eventId || String(new ObjectID())
                      })
                    }
                  />
                </Form.Item>

                {isPublic && (
                  <PublicUrl id={eventId || String(this.state.id)} />
                )}
              </Form.Item>
            </Form>
          </Modal>
          <div role="button" onClick={() => this.setState({ isVisible: true })}>
            {children}
          </div>
        </div>
      );
    }
  }
);

const PublicUrl = connect((state: { base: { origin: string } }) => ({
  origin: state.base.origin
}))(function({ id, origin }: { id: string; origin: string }): JSX.Element {
  return <span>{`${origin}/note/${id}`}</span>;
});
