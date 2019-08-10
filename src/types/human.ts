// @flow

import { TContact } from "./contact";

export interface THuman extends TContact {
  _id?: string;

  // Name card
  emails: Array<string>;
  name: string;
  avatarUrl: string;
  address: string;
  bornAt: string;
  bornAddress: string;

  // How do we meet?
  knownAt: string; // date
  knownSource: string;

  // Personalities
  extraversionIntroversion:
    | ""
    | "introversion"
    | "extroversion"
    | "ambiversion";
  intuitingSensing: "" | "intuiting" | "sensing";
  thinkingFeeling: "" | "thinking" | "feeling";
  planingPerceiving: "" | "planing" | "perceiving";
  tdp: "" | "creator" | "refiner" | "advancer" | "executor" | "flexor";
  inboundTrust: 1;
  outboundTrust: 1;

  // bio
  blurb: string;
  workingOn: string;
  desire: string;
  // experiences
  title: string;
  experience: [
    {
      title: string;
      name: string;
    }
  ];
  education: [
    {
      title: string;
      name: string;
    }
  ];

  // social
  linkedin: string;
  facebook: string;

  // meta
  createdAt?: string;
  updatedAt?: string;
}

export type TInteraction = {
  id: string;
  timestamp: Date;
  content: string;
  contentHtml: string;
};
