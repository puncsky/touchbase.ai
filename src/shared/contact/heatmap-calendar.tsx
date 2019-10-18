import gql from "graphql-tag";
import React from "react";
import { Query, QueryResult } from "react-apollo";
// @ts-ignore
import CalendarHeatmap from "react-calendar-heatmap";
import { Preloader } from "../common/preloader";

const GET_COUNT = gql`
  query interactionCounts($isSelf: Boolean, $contactId: String) {
    interactionCounts(isSelf: $isSelf, contactId: $contactId) {
      count
      date
    }
  }
`;

type Props = {
  isSelf: boolean;
  contactId: string;
};

export function HeatmapCalendar({ isSelf, contactId }: Props): JSX.Element {
  const today = new Date();

  return (
    <div style={{ overflowX: "auto", direction: "rtl", overflowY: "hidden" }}>
      <div style={{ height: "100px", width: "620px" }}>
        <Query
          query={GET_COUNT}
          variables={{
            isSelf,
            contactId
          }}
        >
          {({
            data,
            error,
            loading
          }: QueryResult<{
            interactionCounts: Array<{ count: number; date: string }>;
          }>) => {
            if (loading || error || !data) {
              return <Preloader />;
            }

            return (
              <CalendarHeatmap
                startDate={shiftDate(today, -365)}
                endDate={today}
                values={data.interactionCounts}
                gutterSize={2}
                classForValue={(value: { count: number; date: string }) => {
                  if (!value) {
                    return "color-empty";
                  }
                  return `color-github-${value.count}`;
                }}
                tooltipDataAttrs={(value: { count: number; date: string }) => {
                  if (!value || !value.date) {
                    return null;
                  }

                  return {
                    "data-tip": `${new Date(value.date)
                      .toISOString()
                      .slice(0, 10)} has count: ${value.count}`
                  };
                }}
                showWeekdayLabels={true}
              />
            );
          }}
        </Query>
      </div>
    </div>
  );
}

function shiftDate(date: Date, numDays: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}
