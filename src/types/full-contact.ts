type TDate = {
  year: number;
  month?: number;
};

type TInterest = {
  name: string;
  id: string;
  affinity: "LOW" | "MEDIUM" | "HIGH";
  parentIds: Array<string>;
  category: string;
};

type TGender = "Male" | "Female";

export type TFullContact = {
  fullName: string;
  ageRange: string;
  gender: TGender;
  location: string;
  title: string;
  organization: string;
  // social
  twitter: string;
  linkedin: string;
  facebook: string;
  github: string;

  bio: string;
  avatar: string;
  website: string;

  details: {
    name: {
      given: string;
      family: string;
    };
    age: string;
    gender: TGender;
    emails: Array<{
      label: string;
      value: string;
    }>;
    profiles: {};
    employment: Array<{
      name: string;
      title: string;
      current: boolean;
      start?: TDate;
      end?: TDate;
    }>;
    education: Array<{
      name: string;
      degree: string;
      start?: TDate;
      end?: TDate;
    }>;
    interests: Array<TInterest>;
  };
};
