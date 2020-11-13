import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { AgGridReact } from "@ag-grid-community/react";
// @ts-ignore
import omitDeep from "omit-deep-lodash";
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { GetContacts_contacts as TContact2 } from "./data/__generated__/GetContacts";
import { FOOTER_ABOVE } from "../common/footer";
import { Preloader } from "../common/preloader";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { actionUpdateHuman } from "../contact/human-reducer";
import { useGetContacts } from "./hooks/useGetContacts";
// eslint-disable-next-line import/order
import isBrowser = require("is-browser");

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
  github: string;
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

const defaultColumnProperties = {
  width: 120
};

const rowFromHuman = (h: TContact2) => ({
  ...h,
  experienceTitle: h.experience[0] && h.experience[0].title,
  experienceName: h.experience[0] && h.experience[0].name,
  educationName: h.education[0] && h.education[0].name,
  emailsJoin: (h.emails || []).join(", ")
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

const encodeHtmlSource = (source: string) => {
  if (source.length === 0) {
    return "";
  }

  source = source.replace(/&/g, "&amp;");
  source = source.replace(/</g, "&lt;");
  source = source.replace(/>/g, "&gt;");
  source = source.replace(/ /g, "&nbsp;");
  source = source.replace(/'/g, "&#39;");
  source = source.replace(/"/g, "&quot;");

  return source;
};

export function ContactsTableContainer1(): JSX.Element {
  const { data, error, loading } = useGetContacts();
  const humans = data?.contacts || [];
  const history = useHistory();
  const dispatch = useDispatch();

  const onCellValueChanged = ({
    data: cellData,
    newValue,
    oldValue,
    ...otherProps
  }: any) => {
    if (newValue === oldValue) {
      return;
    }
    dispatch(
      actionUpdateHuman(
        updateHumanFromRow(
          { ...cellData, [otherProps.colDef.field]: newValue },
          humans[otherProps.rowIndex]
        ),
        true
      )
    );
  };

  const onGridReady = (): void => {
    if (!isBrowser) {
      return;
    }
    const els = document.getElementsByClassName(PUSH_LINK_CLS) || [];
    // @ts-ignore
    for (const el of els) {
      el.addEventListener("click", (e: Event) => {
        e.preventDefault();
        history.push(el.getAttribute("href"));
      });
    }
  };

  // looks like `t` only works in render.
  const columnDefs = [
    {
      field: "name",
      headerName: t("field.name"),
      checkboxSelection: true,
      cellRenderer: ({
        value,
        data: dataCell
      }: {
        value: string;
        data: { _id: string };
      }) =>
        `<span>
          <a class=${PUSH_LINK_CLS} style="color: ${
          colors.primary
        };" href=${`"/${dataCell._id}/"`} />
          ${encodeHtmlSource(value)}
        </span>`
    },
    { field: "experienceTitle", headerName: t("experience.title") },
    { field: "inboundTrust", headerName: t("field.inbound_trust") },
    { field: "outboundTrust", headerName: t("field.outbound_trust") },
    { field: "address", headerName: t("field.address") },
    { field: "experienceName", headerName: t("experience.org") },
    { field: "emailsJoin", headerName: t("field.emails") },
    { field: "bornAt", headerName: t("bornAt") },
    { field: "bornAddress", headerName: t("bornAddress") },
    { field: "desire", headerName: t("field.desire") },
    { field: "knownAt", headerName: t("field.known_at") },
    { field: "knownSource", headerName: t("field.known_source") },
    { field: "educationName", headerName: t("field.education") }
  ].map(c => ({ ...c, ...defaultColumnProperties }));

  return (
    <ContentPadding>
      <Helmet
        link={[
          {
            rel: "stylesheet",
            type: "text/css",
            href: assetURL("./stylesheets/all-table-main.css")
          }
        ]}
      />
      <div
        className="ag-theme-balham"
        style={{ width: "100%", height: FOOTER_ABOVE.minHeight }}
      >
        {() => {
          if (loading || error || !data) {
            return <Preloader />;
          }

          const rows = humans.map(rowFromHuman);

          return (
            <AgGridReact
              onGridReady={onGridReady}
              enableSorting={true}
              rowSelection="multiple"
              enableFilter={true}
              columnDefs={columnDefs}
              rowData={rows}
              onCellValueChanged={onCellValueChanged}
              // @ts-ignore
              modules={[ClientSideRowModelModule]}
              defaultColDef={{ editable: true }}
            />
          );
        }}
      </div>
    </ContentPadding>
  );
}
