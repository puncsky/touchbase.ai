import { AgGridReact } from "ag-grid-react";
import gql from "graphql-tag";
import isBrowser = require("is-browser");
import omitDeep from "omit-deep-lodash";
import { assetURL } from "onefx/lib/asset-url";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { RouterProps, withRouter } from "react-router";
import { TContact2 } from "../../types/human";
import { FOOTER_ABOVE } from "../common/footer";
import { Preloader } from "../common/preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { actionUpdateHuman } from "../contact/human-reducer";

const PUSH_LINK_CLS = "push-link";

type THumanRow = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  emailsJoin: string;
  name: string;
  avatarUrl: string;
  address: string;
  bornAt: string;
  bornAddress: string;
  workingOn: string;
  desire: string;
  experienceTitle: string;
  experienceName: string;
  educationTitle: string;
  educationName: string;
  extraversionIntroversion:
    | ""
    | "introversion"
    | "extroversion"
    | "ambiversion";
  facebook: string;
  intuitingSensing: "" | "intuiting" | "sensing";
  knownAt: "2018-10-13T08:00:36.591Z";
  knownSource: string;
  linkedin: string;
  planingPerceiving: "" | "planing" | "perceiving";
  tdp: "" | "creator" | "refiner" | "advancer" | "executor" | "flexor";
  thinkingFeeling: "" | "thinking" | "feeling";
  blurb: string;
  inboundTrust: number;
  outboundTrust: number;
};

export const GET_CONTACTS = gql`
  query contacts($offset: Float, $limit: Float) {
    contacts(offset: $offset, limit: $limit) {
      _id
      emails
      name
      avatarUrl
      address
      bornAt
      bornAddress
      knownAt
      knownSource
      extraversionIntroversion
      intuitingSensing
      thinkingFeeling
      planingPerceiving
      tdp
      inboundTrust
      outboundTrust
      blurb
      workingOn
      desire
      title
      experience {
        title
        name
      }
      education {
        title
        name
      }
      linkedin
      facebook
      createAt
      updateAt
    }
  }
`;

type Props = {
  actionUpdateHuman: any;
} & RouterProps;
const defaultColumnProperties = {
  width: 120
};
const columnDefs = [
  {
    field: "name",
    headerName: "Name",
    checkboxSelection: true,
    cellRenderer: ({ value, data }) =>
      `<span><a class=${PUSH_LINK_CLS} style="color: ${
        colors.primary
      };" href=${`"/${data._id}/"`}/>${value}</span>`
  },
  { field: "experienceTitle", headerName: "Title" },
  { field: "inboundTrust", headerName: "In-Trust" },
  { field: "outboundTrust", headerName: "Out-Trust" },
  { field: "address", headerName: "Address" },
  { field: "experienceName", headerName: "Company" },
  { field: "emailsJoin", headerName: "Emails" },
  { field: "bornAt", headerName: "Birthday" },
  { field: "bornAddress", headerName: "Birthplace" },
  { field: "desire", headerName: "desire" },
  { field: "knownAt", headerName: "knownAt" },
  { field: "knownSource", headerName: "knownSource" },
  { field: "educationName", headerName: "Education" }
].map(c => ({ ...c, ...defaultColumnProperties }));

const rowFromHuman = h => ({
  ...h,
  experienceTitle: h.experience[0] && h.experience[0].title,
  experienceName: h.experience[0] && h.experience[0].name,
  educationName: h.education[0] && h.education[0].name,
  emailsJoin: h.emails.join(", ")
});

const updateHumanFromRow = (row: THumanRow, initialHuman: TContact2) => {
  const {
    experienceTitle,
    experienceName,
    educationName,
    emailsJoin,
    ...otherProps
  } = row;
  const clone = {
    ...initialHuman,
    ...otherProps,
    experience: [...initialHuman.experience],
    education: [...initialHuman.education]
  };
  clone.experience[0] = { title: experienceTitle, name: experienceName };
  if (clone.education[0]) {
    clone.education[0].name = educationName;
  } else {
    clone.education[0] = { name: educationName, title: "" };
  }
  clone.emails = emailsJoin
    .split(",")
    .map(e => e.toLowerCase().replace(/ /g, ""));
  clone.inboundTrust = Number(clone.inboundTrust);
  clone.outboundTrust = Number(clone.outboundTrust);
  return omitDeep(clone, "__typename");
};

// @ts-ignore
export const ContactsTableContainer = withRouter(
  // @ts-ignore
  connect(
    () => ({}),
    (dispatch: any) => ({
      actionUpdateHuman: (human: TContact2) =>
        dispatch(actionUpdateHuman(human, true))
    })
  )(
    class ContactsTable extends Component<Props> {
      public props: Props;

      humans: Array<TContact2>;

      public onCellValueChanged = ({
        data,
        newValue,
        oldValue,
        ...otherProps
      }: any) => {
        if (newValue === oldValue) {
          return;
        }
        this.props.actionUpdateHuman(
          updateHumanFromRow(
            { ...data, [otherProps.colDef.field]: newValue },
            this.humans[otherProps.rowIndex]
          )
        );
      };

      public onGridReady = (): void => {
        if (!isBrowser) {
          return;
        }
        const els = document.getElementsByClassName(PUSH_LINK_CLS) || [];
        // @ts-ignore
        for (const el of els) {
          el.addEventListener("click", e => {
            e.preventDefault();
            this.props.history.push(el.getAttribute("href"));
          });
        }
      };

      public render(): JSX.Element {
        return (
          <ContentPadding>
            <Helmet
              link={[
                {
                  rel: "stylesheet",
                  type: "text/css",
                  href: assetURL("/stylesheets/all-table-main.css")
                }
              ]}
            />
            <div
              className="ag-theme-balham"
              style={{ width: "100%", height: FOOTER_ABOVE.minHeight }}
            >
              <Query query={GET_CONTACTS}>
                {({
                  data,
                  error,
                  loading
                }: QueryResult<{ contacts: Array<TContact2> }>) => {
                  if (loading || error || !data) {
                    return <Preloader />;
                  }

                  this.humans = data.contacts;
                  const rows = data.contacts.map(rowFromHuman);

                  return (
                    <AgGridReact
                      onGridReady={this.onGridReady}
                      enableSorting={true}
                      rowSelection="multiple"
                      enableFilter={true}
                      columnDefs={columnDefs}
                      rowData={rows}
                      onCellValueChanged={this.onCellValueChanged}
                      defaultColDef={{ editable: true }}
                    />
                  );
                }}
              </Query>
            </div>
          </ContentPadding>
        );
      }
    }
  )
);
