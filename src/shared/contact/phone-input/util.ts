import countries from "./countries.json";

interface CountryInfo {
  iso2: string;
  format?: string;
  callingCode: string;
}

let callingCodeCountryMap: { [x: string]: CountryInfo };
export function guessCountry(phone: string): CountryInfo {
  if (!callingCodeCountryMap) {
    callingCodeCountryMap = countries.reduce((acc, country) => {
      const callingCode = country[1] as string;
      if (!acc[callingCode] || country[country.length - 1] === 1) {
        acc[callingCode] = {
          iso2: `${country[3]}`,
          callingCode: `${country[1]}`,
          format: typeof country[4] === "string" ? country[4] : undefined
        };
      }
      return acc;
    }, {} as { [x: string]: CountryInfo });
  }
  const text = phone.replace(/\D/g, "");
  for (let i = 0; i < 3 && i < text.length; i += 1) {
    const code = text.substr(0, i + 1);
    if (callingCodeCountryMap[code]) {
      return callingCodeCountryMap[code];
    }
  }
  return { iso2: "", callingCode: "" };
}

let iso2CallingCodeMap: { [x: string]: string };
export function getCallingCode(iso2: string): string {
  if (!iso2CallingCodeMap) {
    iso2CallingCodeMap = countries.reduce((acc, country) => {
      // eslint-disable-next-line prefer-destructuring
      acc[country[3]] = country[1];
      return acc;
    }, {} as any);
  }
  return iso2CallingCodeMap[iso2];
}

export function formatToE164(text: string): string {
  return `+${text.replace(/\D/g, "")}`;
}

export function formatNumber(phone: string, patternArg?: string): string {
  const pattern = patternArg && patternArg.split("");

  const text = phone.replace(/\D/g, "");
  if (!text || text.length === 0) {
    return "+";
  }

  if ((text && text.length < 2) || !pattern) {
    return `+${text}`;
  }

  const formattedObject = pattern.reduce(
    (acc, character) => {
      if (acc.remainingText.length === 0) {
        return acc;
      }

      if (character !== ".") {
        return {
          formattedText: acc.formattedText + character,
          remainingText: acc.remainingText
        };
      }

      const [head, ...tail] = acc.remainingText;

      return {
        formattedText: acc.formattedText + head,
        remainingText: tail
      };
    },
    {
      formattedText: "",
      remainingText: text.split("")
    }
  );

  let formattedNumber = formattedObject.formattedText;

  if (formattedNumber.includes("(") && !formattedNumber.includes(")")) {
    formattedNumber += ")";
  }
  return formattedNumber;
}
