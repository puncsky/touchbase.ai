import React from "react";
// @ts-ignore
import CalendarHeatmap from "react-calendar-heatmap";
import { Preloader } from "../common/preloader";
import { useGetInteractionCounts } from "./hooks/useGetInteractionCounts";

type Props = {
  isSelf: boolean;
  contactId: string;
};

export function HeatmapCalendar({ isSelf, contactId }: Props): JSX.Element {
  const today = new Date();
  const { data, error, loading } = useGetInteractionCounts({
    isSelf,
    contactId
  });
  return (
    <div style={{ overflowX: "auto", direction: "rtl", overflowY: "hidden" }}>
      <div style={{ height: "100px", width: "620px" }}>
        {(() => {
          if (loading || error || !data) {
            return <Preloader />;
          }

          return (
            <CalendarHeatmap
              startDate={shiftDate(today, -365)}
              endDate={today}
              values={data.interactionCounts || []}
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
        })()}
      </div>
    </div>
  );
}

function shiftDate(date: Date, numDays: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}
