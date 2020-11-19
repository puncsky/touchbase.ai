import DatePicker from "antd/lib/date-picker";
import Form from "antd/lib/form";
import Modal from "antd/lib/modal";
import { FormInstance } from "antd/lib/form/Form";
import Switch from "antd/lib/switch";
import ObjectID from "bson-objectid";
import moment from "moment";
import { t } from "onefx/lib/iso-i18n";
import { Helmet } from "onefx/lib/react-helmet";
import React, { Component } from "react";
import { connect } from "react-redux";
import { TContact2 } from "../../../types/human";
import { loadScript } from "../../common/load-script";
import { MdEditor } from "../../common/md-editor";
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
  id: string;
};

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

    public getSimpleMde: any = null;

    public state: State = {
      isVisible: false,
      public: false,
      id: ""
    };

    formRef: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    constructor(props: Props) {
      super(props);
      this.state.public = props.public;
    }

    componentDidMount(): void {
      // after load css
      loadScript(
        "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"
        // tslint:disable-next-line: no-empty
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
              this.setState({ isVisible: false });
              if (!initialValue) {
                this.getSimpleMde().value("");
              }
            }}
            onOk={() => {
              if (!this.formRef.current) {
                return;
              }
              this.formRef.current
                .validateFields()
                .then(values => {
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
                })
                .catch(({ errorFields }) => {
                  if (this.formRef.current) {
                    this.formRef.current.scrollToField(errorFields[0].name);
                  }
                });
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
              <MdEditor
                initialValue={initialValue}
                getSimpleMde={getSimpleMde => {
                  this.getSimpleMde = getSimpleMde;
                }}
              />
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
