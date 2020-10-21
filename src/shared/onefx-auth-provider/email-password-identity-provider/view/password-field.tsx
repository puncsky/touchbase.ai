import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { FieldMargin } from "./field-margin";
import { InputError } from "./input-error";
import { InputLabel } from "./input-label";
import { TextInput } from "./text-input";

type Props = {
  defaultValue: string;
  error: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function PasswordField({
  defaultValue,
  error,
  onChange
}: Props): JSX.Element {
  return (
    <FieldMargin>
      <InputLabel htmlFor="email-login-password">
        {t("auth/password")}
      </InputLabel>
      <TextInput
        defaultValue={defaultValue}
        onChange={onChange}
        error={!!error}
        type="password"
        aria-label="Password"
        id="email-login-password"
        name="password"
        placeholder={t("auth/password")}
      />
      <InputError>{error || "\u0020"}</InputError>
    </FieldMargin>
  );
}
