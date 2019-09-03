import React from "react";
import { Flex } from "../common/flex";
import { colors } from "../common/styles/style-color";

export function SuggestedActions(props: any): JSX.Element {
  return (
    <Flex {...props} backgroundColor={colors.warning50} color={colors.text02}>
      <div>To work with Achiever</div>
      <ol>
        <li>Work hard with them. They are annoyed by slackers.</li>
        <li>
          Invite them to meetings that you really need them and they can be
          fully engaged. Otherwise, leave them alone and let them get things
          done.
        </li>
        <li>
          They often sleep less and get up earlier. Ask them “how late did you
          work to get things done?” Also, “when did you come here this morning?”
          They appreciate attention like this.
        </li>
      </ol>
    </Flex>
  );
}
