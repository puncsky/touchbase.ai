// @flow
import { DatePicker, Form, Modal } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Switch from "antd/lib/switch";
import ObjectID from "bson-objectid";
import moment from "moment";
import { t } from "onefx/lib/iso-i18n";
import Helmet from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { connect } from "react-redux";
import { TContact2 } from "../../../types/human";
import { loadScript } from "../../common/load-script";
import { MdEditor } from "../../common/md-editor";
import { TOP_BAR_HEIGHT } from "../../common/top-bar";
import { actionUpsertEvent } from "../human-reducer";

type Props = {
  // container
  actionUpsertEvent(payload: any, contactId: string, isSelf: boolean): void;
  ownerHumanId: string;
  humanId: string;
  form?: WrappedFormUtils;

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
  id: string;
};

export const UpsertEventContainer = Form.create<
  Props & { form: WrappedFormUtils }
>({ name: "event" })(
  connect(
    (state: { base: { ownerHumanId: string }; human: TContact2 }) => ({
      ownerHumanId: state.base.ownerHumanId
    }),
    (dispatch: any) => ({
      actionUpsertEvent: (payload: any, contactId: string, isSelf: boolean) =>
        dispatch(actionUpsertEvent(payload, contactId, isSelf))
    })
  )(
    // @ts-ignore
    class Edit extends Component<Props, State> {
      public props: Props;
      public getSimpleMde: any = null;

      public state: State = {
        isVisible: false,
        public: false,
        id: ""
      };

      constructor(props: Props) {
        super(props);
        this.state.public = props.public;
      }

      componentDidMount(): void {
        // after load css
        loadScript(
          "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js",
          // tslint:disable-next-line: no-empty
          () => {}
        );
      }

      // tslint:disable-next-line: max-func-body-length
      public render(): JSX.Element | null {
        const {
          actionUpsertEvent,
          ownerHumanId,
          humanId,
          initialValue,
          eventId,
          children,
          timestamp,
          form
        } = this.props;
        const getFieldDecorator = form && form.getFieldDecorator;
        if (!form || !getFieldDecorator) {
          return null;
        }
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
                this.setState({ isVisible: false });
                if (!initialValue) {
                  this.getSimpleMde().value("");
                }
              }}
              onOk={() => {
                const values = form.getFieldsValue();
                actionUpsertEvent(
                  {
                    id: eventId || String(this.state.id),
                    content: this.getSimpleMde().value(),
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
                  this.getSimpleMde().value("");
                }
                this.setState({ isVisible: false });
              }}
              destroyOnClose
            >
              <Form>
                <Form.Item>
                  {getFieldDecorator("timestamp", {
                    initialValue: moment(timestamp || new Date())
                  })(<DatePicker showTime allowClear={false} />)}
                </Form.Item>
                <MdEditor
                  initialValue={initialValue}
                  getSimpleMde={getSimpleMde =>
                    (this.getSimpleMde = getSimpleMde)
                  }
                />
                <Form.Item label={t("make_public")}>
                  {getFieldDecorator(
                    "public",
                    {}
                  )(
                    <Switch
                      defaultChecked={isPublic}
                      onChange={v =>
                        this.setState({
                          public: v,
                          id: eventId || String(new ObjectID())
                        })
                      }
                    />
                  )}

                  {isPublic && (
                    <span>{`https://guanxilab.com/note/${eventId ||
                      String(this.state.id)}`}</span>
                  )}
                </Form.Item>
              </Form>
            </Modal>
            <div
              role="button"
              onClick={() => this.setState({ isVisible: true })}
            >
              {children}
            </div>
          </div>
        );
      }
    }
  )
);
