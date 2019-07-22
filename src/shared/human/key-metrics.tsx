import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { LINE } from "../common/box-shadow";
import { Flex } from "../common/flex";
import { fonts } from "../common/styles/style-font";

type TMetrics = {
  interactions: number;
  interactionsPerQuarter: number;
  knownAt: string;
  inboundTrust: number;
  outboundTrust: number;
};

export function KeyMetrics({ metrics }: { metrics: TMetrics }): JSX.Element {
  return (
    <Flex
      width="100%"
      justifyContent="space-between"
      textAlign="center"
      borderTop={LINE}
      borderBottom={LINE}
      padding="8px 0 8px 0"
    >
      <Flex width="100%" justifyContent="space-between">
        <div>
          <div style={fonts.h4}>{metrics.interactions}</div>
          <div>{t("interactions")}</div>
        </div>

        <div>
          <div style={fonts.h4}>{metrics.interactionsPerQuarter}</div>
          <div>{t("ipq")}</div>
        </div>

        <div>
          <FromNow dateString={metrics.knownAt} />
          <div>{t("years_known")}</div>
        </div>
      </Flex>

      <div style={{ margin: "4px" }} />

      <Flex width="100%" justifyContent="space-between">
        <Width50>
          <div style={fonts.h4}>{metrics.inboundTrust}</div>
          <div>{t("inbound_trust")}</div>
        </Width50>

        <Width50>
          <div style={fonts.h4}>{metrics.outboundTrust}</div>
          <div>{t("outbound_trust")}</div>
        </Width50>
      </Flex>
    </Flex>
  );
}

const Width50 = styled("div", { width: "50%" });

function FromNow({ dateString }: { dateString: string }): JSX.Element {
  const totalMonths = monthDiff(new Date(dateString), new Date());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return (
    <div>
      <span style={fonts.h4}>{years} </span>
      <sup style={{ fontSize: "12px" }}>{months}</sup>
      {"/"}
      <sub style={{ fontSize: "12px" }}>12</sub>
    </div>
  );
}

function monthDiff(d1: Date, d2: Date): number {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}
