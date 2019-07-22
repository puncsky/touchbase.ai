import { Button } from "antd";
import dateFormat from "dateformat";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { THuman, TInteraction } from "../../types/human";
import { BOX_SHADOW, LINE } from "../common/box-shadow";
import { Flex } from "../common/flex";
import { shade } from "../common/styles/shade";
import { colors } from "../common/styles/style-color";
import { fonts } from "../common/styles/style-font";
import { fullOnLap } from "../common/styles/style-media";
import { ContentPadding } from "../common/styles/style-padding";
import { UpsertEventContainer } from "./event/upsert-event";
import { KeyMetrics } from "./key-metrics";

function currentTitle(human: THuman): string {
  return (
    human.title ||
    (human.experience[0] && human.experience[0].title) ||
    (human.education[0] && human.education[0].title)
  );
}

function currentOrg(human: THuman): string {
  return (
    human.title ||
    (human.experience[0] && human.experience[0].name) ||
    (human.education[0] && human.education[0].name)
  );
}

const Padding = styled("div", { padding: "8px" });

const SECTION = {
  backgroundColor: colors.black10,
  padding: "12px",
  boxShadow: BOX_SHADOW
};

type Props = { human: THuman; interactions: Array<TInteraction> };

// @ts-ignore
export const HumanProfileContainer = connect(
  (state: { human: THuman; interactions: Array<TInteraction> }) => ({
    human: state.human,
    interactions: state.interactions
  })
)(
  // tslint:disable-next-line:max-func-body-length
  function HumanProfile({ human, interactions }: Props): JSX.Element | null {
    if (!human.name) {
      return null;
    }
    return (
      <ContentPadding>
        <Padding />
        <Flex alignItems="flex-start">
          <Flex width="25%" media={fullOnLap} {...SECTION}>
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
                  <Icon className="far fa-edit" />
                </Link>
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
                interactionsPerQuarter: 0,
                interactions: interactions.length,
                knownAt: human.knownAt,

                inboundTrust: human.inboundTrust,
                outboundTrust: human.outboundTrust
              }}
            />

            <TitleContent title="experience" human={human} />
            <TitleContent title="education" human={human} />
            <TitleContent title="bornAt" human={human} />
            <TitleContent title="bornAddress" human={human} />

            <Padding />
          </Flex>

          <Flex width="50%" media={fullOnLap}>
            {(human.workingOn || human.desire || human.blurb) && [
              <Flex key={0} width="100%" {...SECTION}>
                {human.blurb && <div>{human.blurb}</div>}

                <TitleContent title="workingOn" human={human} />
                <TitleContent title="desire" human={human} />
              </Flex>,
              <Padding key={1} />
            ]}

            <Flex width="100%" {...SECTION}>
              <UpsertEventContainer eventId={""} initialValue={""}>
                {/*
                // @ts-ignore */}
                <Button type="primary">{t("add_event")}</Button>
              </UpsertEventContainer>

              {interactions.map((iter, i) => (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    borderTop: LINE,
                    margin: "12px 0 12px 0",
                    padding: "12px 0 12px 0",
                    wordBreak: "break-word"
                  }}
                >
                  <Flex>
                    <span>
                      {dateFormat(iter.timestamp, "yyyy-mm-dd HH:MM")}{" "}
                    </span>
                    <UpsertEventContainer
                      eventId={iter.id}
                      initialValue={iter.content}
                    >
                      <div style={{ cursor: "pointer" }}>{t("edit")}</div>
                    </UpsertEventContainer>
                  </Flex>
                  <div dangerouslySetInnerHTML={{ __html: iter.contentHtml }} />
                </div>
              ))}
            </Flex>

            <Padding />
          </Flex>

          <Flex width="20%" media={fullOnLap} {...SECTION}>
            <Flex width="100%">
              <strong>Personality</strong>

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
        </Flex>
        <Padding />
      </ContentPadding>
    );
  }
);

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
          human[title].map((h, i) => (
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

const Icon = styled("i", {
  ...{
    position: "absolute",
    bottom: "8px",
    right: "16px",
    fontSize: "18px"
  },

  padding: "8px",
  fontSize: "14px",
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
