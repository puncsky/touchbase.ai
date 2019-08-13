import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import Row from "antd/lib/row";
import dateFormat from "dateformat";
import gql from "graphql-tag";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { THuman, TInteraction } from "../../types/human";
import { BOX_SHADOW, LINE } from "../common/box-shadow";
import { Flex } from "../common/flex";
import { mdit } from "../common/markdownit";
import { shade } from "../common/styles/shade";
import { colors } from "../common/styles/style-color";
import { fonts } from "../common/styles/style-font";
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
  backgroundColor: colors.white,
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
    if (!human || !human.name) {
      return null;
    }
    return (
      <ContentPadding>
        <Padding />

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
                    <Icon1 type="edit" />
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
                  interactions: interactions && interactions.length,
                  knownAt: human.knownAt,

                  inboundTrust: human.inboundTrust,
                  outboundTrust: human.outboundTrust
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
              <UpsertEventContainer eventId={""} initialValue={""}>
                {/*
                // @ts-ignore */}
                <Button type="primary">{t("add_event")}</Button>
              </UpsertEventContainer>

              <Interactions contactId={String(human._id)} />
            </Flex>

            <Padding />
          </Col>
          <Col sm={6} xs={24}>
            <Flex column={true} {...SECTION}>
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
          </Col>
        </Row>
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

const Icon1 = styled(Icon, {
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

const GET_INTERACTIONS = gql`
  query interactions($contactId: String, $offset: Float, $limit: Float) {
    interactions(contactId: $contactId, offset: $offset, limit: $limit) {
      id
      content
      timestamp
    }
  }
`;

class Interactions extends Component<{ contactId: string }> {
  public start: number = 0;

  public static PAGE_SIZE: number = 5;

  public render(): JSX.Element {
    const { contactId } = this.props;

    return (
      <Query
        query={GET_INTERACTIONS}
        ssr={false}
        fetchPolicy="network-only"
        variables={{ contactId, offset: 0, limit: Interactions.PAGE_SIZE }}
      >
        {({
          loading,
          error,
          data,
          fetchMore
        }: QueryResult<{ interactions: Array<TInteraction> }>) => {
          if (loading || error || !data) {
            return <div />;
          }

          return (
            <>
              {data.interactions.map((iter, i) => (
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
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mdit.render(iter.content)
                    }}
                  />
                </div>
              ))}

              {Boolean(data.interactions.length) && (
                <Button
                  onClick={() => {
                    fetchMore({
                      query: GET_INTERACTIONS,
                      variables: {
                        contactId,
                        offset: this.start + Interactions.PAGE_SIZE,
                        limit: Interactions.PAGE_SIZE
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) {
                          return prev;
                        }
                        this.start += Interactions.PAGE_SIZE;
                        window.console.log(
                          JSON.stringify({
                            prev,
                            fetchMoreResult
                          })
                        );
                        return {
                          interactions: [
                            ...prev.interactions,
                            ...fetchMoreResult.interactions
                          ]
                        };
                      }
                    }).catch(err => {
                      window.console.error(
                        `failed fetchMore for interactions: ${err}`
                      );
                    });
                  }}
                >
                  <Icon type="down" />
                  {t("fetch_more")}
                </Button>
              )}
            </>
          );
        }}
      </Query>
    );
  }
}
