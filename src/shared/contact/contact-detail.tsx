import { DownOutlined, EditOutlined } from "@ant-design/icons";

import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import dateFormat from "dateformat";
// @ts-ignore
import omitDeep from "omit-deep-lodash";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Route, Link, useParams } from "react-router-dom";
// @ts-ignore
import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";
import { TContact2, TExperience } from "../../types/human";
import { BOX_SHADOW, LINE } from "../common/box-shadow";
import { CommonMargin } from "../common/common-margin";
import { Flex } from "../common/flex";
import { mdit } from "../common/markdownit";
import { NotFound } from "../common/not-found";
import { Preloader } from "../common/preloader";
import { shade } from "../common/styles/shade";
import { colors } from "../common/styles/style-color";
import { fonts } from "../common/styles/style-font";
import { ContentPadding } from "../common/styles/style-padding";
import { DeleteNotePopover } from "./delete-note-container";
import { UpsertEventContainer } from "./event/upsert-event";
import { HeatmapCalendar } from "./heatmap-calendar";
import { KeyMetrics } from "./key-metrics";
import { ProfileEditorContainer } from "./profile-editor/profile-editor";
import { ReminderCard } from "./reminder-card";
import { TagsContainer } from "./tags";
import { useGetContact } from "./hooks/useGetContact";
import { useGetInteractions } from "./hooks/useGetInteractions";
import { getInteractions } from "./data/queries";

function currentTitle(human: TContact2): string {
  return (
    human?.title ||
    human?.experience[0]?.title ||
    human?.education[0]?.title ||
    ""
  );
}

function currentOrg(human: TContact2): string {
  return (
    human?.title ||
    human?.experience[0]?.name ||
    human?.education[0]?.name ||
    ""
  );
}

const Padding = styled("div", { padding: "8px" });

const SECTION = {
  backgroundColor: colors.white,
  padding: "12px",
  boxShadow: BOX_SHADOW
};

function TitleContent({ title, human }: any): JSX.Element | null {
  if (!human[title]) {
    return null;
  }

  return (
    <div style={{ width: "100%", margin: "8px 0 0 0" }}>
      <div
        style={{
          color: colors.text01,
          textTransform: "uppercase",
          fontSize: "12px"
        }}
      >
        {t(title)}
      </div>
      <div>
        {Array.isArray(human[title]) ? (
          human[title].map((h: TExperience, i: number) => (
            <div
              key={i}
              style={{ marginLeft: "16px", textTransform: "capitalize" }}
            >
              {h.name}
            </div>
          ))
        ) : (
          <div style={{ marginLeft: "16px" }}>
            {(() => {
              const item = human[title];
              if (title === "bornAt") {
                return dateFormat(item, "yyyy/mm/dd");
              }
              return item;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

// tslint:disable-next-line:max-func-body-length
function Contact({
  human,
  isSelf
}: {
  human: TContact2;
  isSelf?: boolean;
}): JSX.Element {
  return (
    <Row gutter={16}>
      <Col sm={6} xs={24}>
        <Flex {...SECTION}>
          <Flex>
            <div style={{ paddingBottom: "8px" }}>{human.address}</div>
          </Flex>
          <Flex width="100%" column={true}>
            <div style={{ position: "relative" }}>
              <img
                alt="favicon"
                style={{ width: "100%", maxWidth: "272px" }}
                src={human.avatarUrl || "/favicon-light.svg"}
              />
              <Link to="./edit/">
                <Icon1 />
              </Link>
              <Route
                exact
                path="*/edit/"
                component={() => <ProfileEditorContainer human={human} />}
              />
            </div>
          </Flex>

          <Flex
            width="100%"
            center={true}
            column={true}
            padding="8px 0 8px 0"
            textAlign="center"
          >
            <h2 style={fonts.h2}>{human.name}</h2>
            <h3 style={fonts.h5}>{currentTitle(human)}</h3>
            <h3 style={fonts.h5}>{currentOrg(human)}</h3>
          </Flex>

          <KeyMetrics
            metrics={{
              knownAt: human.knownAt,

              inboundTrust: human.inboundTrust || 0,
              outboundTrust: human.outboundTrust || 0
            }}
          />

          <TitleContent title="experience" human={human} />
          <TitleContent title="education" human={human} />
          <TitleContent title="bornAt" human={human} />
          <TitleContent title="bornAddress" human={human} />
        </Flex>

        <Padding />
      </Col>
      <Col sm={12} xs={24}>
        {(human.workingOn || human.desire || human.blurb) && [
          <Flex key={0} width="100%" {...SECTION}>
            {human.blurb && <div>{human.blurb}</div>}

            <TitleContent title="workingOn" human={human} />
            <TitleContent title="desire" human={human} />
          </Flex>,
          <Padding key={1} />
        ]}

        <Flex width="100%" {...SECTION}>
          <TagsContainer contactId={human._id || ""} />
          <HeatmapCalendar
            isSelf={Boolean(isSelf)}
            contactId={String(human._id)}
          />
          <ReactTooltip />

          <Flex width="100%">
            {/*
            // @ts-ignore */}
            <UpsertEventContainer
              eventId=""
              initialValue=""
              humanId={human._id || ""}
              public={false}
            >
              {/*
                // @ts-ignore */}
              <Button type="primary">{t("add_event")}</Button>
            </UpsertEventContainer>
          </Flex>

          <Interactions contactId={String(human._id)} isSelf={isSelf} />
        </Flex>

        <Padding />
      </Col>
      <Col sm={6} xs={24}>
        {!isSelf && (
          <>
            <ReminderCard contactId={human._id || ""} />
            <Padding />
          </>
        )}

        <Flex column={true} {...SECTION}>
          <Flex width="100%">
            <strong>{t("personality")}</strong>

            <TitleContent title="extraversionIntroversion" human={human} />
            <TitleContent title="intuitingSensing" human={human} />
            <TitleContent title="thinkingFeeling" human={human} />
            <TitleContent title="planingPerceiving" human={human} />
          </Flex>

          <Padding />

          <Flex width="100%" borderTop={LINE}>
            <TitleContent title="tdp" human={human} />
            <TitleContent title="knownSource" human={human} />
            <TitleContent title="interests" human={human} />
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
}

export function ContactDetailContainer(props: {
  isSelf?: boolean;
}): JSX.Element {
  const { nameDash: id } = useParams<{ nameDash: string }>();

  const ownerHumanId = useSelector(
    (state: { base: { ownerHumanId: string } }) => state.base.ownerHumanId
  );
  const { data, error, loading } = useGetContact({
    id: props.isSelf ? ownerHumanId : id,
    isSelf: props.isSelf
  });

  return (
    <ContentPadding>
      <Padding />

      {(() => {
        if (loading) {
          return <Preloader />;
        }
        if (error || !data) {
          return <NotFound />;
        }

        const human = omitDeep(data.contact, "__typename");

        if (!human) {
          return <NotFound />;
        }

        return (
          <Contact human={human} isSelf={ownerHumanId === id || props.isSelf} />
        );
      })()}
      <Padding />
    </ContentPadding>
  );
}

const Icon1 = styled(EditOutlined, {
  ...{
    position: "absolute",
    bottom: "8px",
    right: "16px",
    fontSize: "18px"
  },

  padding: "6px",
  fontSize: "16px",
  width: "30px",
  height: "30px",
  textAlign: "center",
  textDecoration: "none",
  margin: "5px 2px",
  borderRadius: "50%",
  ":hover": {
    background: shade(colors.primary)
  },
  cursor: "pointer",
  background: colors.primary,
  color: colors.white
});

export const PAGE_SIZE = 5;

const InteractionList = styled("div", {
  width: "100%",
  borderTop: LINE,
  margin: "12px 0 12px 0",
  padding: "12px 0 12px 0",
  wordBreak: "break-word"
});

function Interactions(props: {
  contactId: string;
  isSelf?: boolean;
}): JSX.Element {
  const { contactId, isSelf } = props;

  const query: Record<string, any> = {
    offset: 0,
    limit: PAGE_SIZE
  };
  if (isSelf) {
    query.isSelf = true;
  } else {
    query.contactId = contactId;
  }

  const {
    loading,
    data = { interactions: { interactions: [], count: 0 } },
    fetchMore
  } = useGetInteractions(query);

  if (loading) {
    return <Preloader />;
  }

  const loadMore = () => () => {
    fetchMore({
      query: getInteractions,
      variables: {
        contactId,
        offset: (data.interactions.interactions || []).length,
        limit: PAGE_SIZE
      },
      // TODO: updateQuery is deprecated, use cache merge instead
      updateQuery: (
        prev: any,
        { fetchMoreResult }: { fetchMoreResult: any }
      ) => {
        if (!fetchMoreResult) {
          return prev;
        }
        window.console.log(
          JSON.stringify({
            prev,
            fetchMoreResult
          })
        );
        return {
          ...prev,
          interactions: {
            ...prev.interactions,
            interactions: [
              ...prev.interactions.interactions,
              ...fetchMoreResult.interactions.interactions
            ],
            count: fetchMoreResult.interactions.count
          }
        };
      }
    }).catch((err: Error) => {
      window.console.error(`failed fetchMore for interactions: ${err}`);
    });
  };

  return (
    <>
      {(data.interactions.interactions || []).map((iter, i) => (
        <InteractionList className="interactions-list" key={i}>
          <Flex>
            <span>{dateFormat(iter.timestamp, "yyyy-mm-dd HH:MM")} </span>
            <Flex>
              <UpsertEventContainer
                eventId={iter.id}
                initialValue={iter.content}
                humanId={contactId}
                timestamp={iter.timestamp}
                public={iter.public || false}
              >
                <Button type="link" size="small">
                  {t("edit")}
                </Button>
              </UpsertEventContainer>
              <CommonMargin />
              <DeleteNotePopover
                // @ts-ignore
                isSelf={isSelf}
                noteId={iter.id}
                contactId={contactId}
              />
            </Flex>
          </Flex>
          <div
            dangerouslySetInnerHTML={{
              __html: mdit.render(iter.content)
            }}
          />
        </InteractionList>
      ))}
      {!!data.interactions.interactions &&
        data.interactions.interactions.length > 0 &&
        data.interactions.count > data.interactions.interactions.length && (
          <Button onClick={loadMore}>
            <DownOutlined />
            {t("fetch_more")}
          </Button>
        )}
    </>
  );
}
