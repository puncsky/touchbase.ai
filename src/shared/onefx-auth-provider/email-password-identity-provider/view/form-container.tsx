/* tslint:disable:typedef */
import React, { ReactNode } from "react";
import { connect } from "react-redux";

type Props = {
  id: string;
  children: ReactNode;
  onSubmit?: ((event: any) => void) | undefined;
  csrfToken?: string;
  qs?: string;
  csrfInQuery?: string;
  dispatch?: string;
  // @ts-ignore
  otherProps?;
};

function Form({
  children,
  csrfToken,
  qs,
  csrfInQuery,
  dispatch,
  ...otherProps
}: Props): JSX.Element {
  return (
    <form method="POST" {...otherProps}>
      <input type="hidden" name="_csrf" value={csrfToken} />
      {children}
    </form>
  );
}

type ConnectProps = {
  csrfToken: string;
};

// @ts-ignore
export const FormContainer = connect<ConnectProps>(state => ({
  // @ts-ignore
  csrfToken: state.base.csrfToken
}))(
  // @ts-ignore
  Form
);
