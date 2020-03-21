import { Button } from "antd";
import blockstack from "blockstack";
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";

export class ContinueWithBlockstack extends PureComponent {
  public render(): JSX.Element {
    return (
      <Button
        // @ts-ignore
        type="secondary"
        size={"large"}
        onClick={() => {
          blockstack.redirectToSignIn(
            "http://localhost:4103/login/blockstack-success"
          );
        }}
      >
        {t("auth/continue_with_blockstack")}
      </Button>
    );
  }
}
