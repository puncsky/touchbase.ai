import React from "react";
import { ContentPadding } from "./common/styles/style-padding";
import { WrappedHumanForm } from "./human/human-form";

export function Onboard(): JSX.Element {
  return (
    <ContentPadding>
      <WrappedHumanForm />
    </ContentPadding>
  );
}
