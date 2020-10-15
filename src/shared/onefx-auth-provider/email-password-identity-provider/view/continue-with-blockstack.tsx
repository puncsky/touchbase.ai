import { Button } from "antd";
import blockstack from "blockstack";
import { t } from "onefx/lib/iso-i18n";
import React, { PureComponent } from "react";
import { connect } from "react-redux";

export const ContinueWithBlockstack = connect(
  (state: { base: { origin: string } }) => {
    return {
      origin: state.base.origin
    };
  }
)(
  class ContinueWithBlockstack extends PureComponent<{ origin: string }> {
    public render(): JSX.Element {
      return (
        <Button
          // @ts-ignore
          type="secondary"
          size="large"
          onClick={() => {
            blockstack.redirectToSignIn(`${origin}/login/blockstack-success`);
          }}
        >
          {t("auth/continue_with_blockstack")}
        </Button>
      );
    }
  }
);
