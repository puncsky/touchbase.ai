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
  knownAt: Date; // date
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
  inboundTrust: number;
  outboundTrust: number;

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
  createAt?: Date;
  updateAt?: Date;
}

export type TInteraction = {
  id: string;
  timestamp: Date;
  content: string;
  contentHtml?: string;

  relatedHumans: Array<string>;
};
