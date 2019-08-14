import { Alert } from "antd";
import React from "react";

export function SuggestedActions(): JSX.Element {
  return (
    <div style={{ width: "300px", margin: "12px" }}>
      <Alert
        message="To work with Achiever"
        description={
          <ol>
            <li>Work hard with them. They are annoyed by slackers.</li>
            <li>
              Invite them to meetings that you really need them and they can be
              fully engaged. Otherwise, leave them alone and let them get things
              done.
            </li>
            <li>
              They often sleep less and get up earlier. Ask them “how late did
              you work to get things done?” Also, “when did you come here this
              morning?” They appreciate attention like this.
            </li>
          </ol>
        }
        type="warning"
      />
    </div>
  );
}
