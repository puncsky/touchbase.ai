import { AgGridReact } from "ag-grid-react";
import { assetURL } from "onefx/lib/asset-url";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { THuman } from "../../types/human";
import { FOOTER_ABOVE } from "../common/footer";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { actionUpdateHuman } from "../contact/human-reducer";

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
  inboundTrust: 1;
  outboundTrust: 1;
};

type Props = {
  humans: Array<THuman>;
  rows: Array<THumanRow>;
  actionUpdateHuman: any;
};
const defaultColumnProperties = {
  width: 120
};
const columnDefs = [
  {
    field: "name",
    headerName: "Name",
    checkboxSelection: true,
    cellRenderer: ({ value, data }) =>
      `<span style="color: red;"><a style="color: ${
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

const updateHumanFromRow = (row, initialHuman) => {
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
  return clone;
};

// @ts-ignore
export const ContactsTableContainer = connect(
  (state: { humans: Array<THuman> }) => ({
    humans: state.humans,
    rows: state.humans && state.humans.map(rowFromHuman)
  }),
  (dispatch: any) => ({
    actionUpdateHuman: (human: THuman) =>
      dispatch(actionUpdateHuman(human, true))
  })
)(
  class ContactsTable extends Component<Props> {
    public props: Props;

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
          this.props.humans[otherProps.rowIndex]
        )
      );
    };

    public render(): JSX.Element {
      const { rows } = this.props;
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
            <AgGridReact
              enableSorting={true}
              rowSelection="multiple"
              enableFilter={true}
              columnDefs={columnDefs}
              rowData={rows}
              onCellValueChanged={this.onCellValueChanged}
              defaultColDef={{ editable: true }}
            />
          </div>
        </ContentPadding>
      );
    }
  }
);
