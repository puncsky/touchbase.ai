import { MyServer } from "../server/start-server";
import { ContactModel } from "./contact-model";
import { PersonalNoteModel } from "./personal-note-model";

export type Model = {
  contact: ContactModel;
  human: ContactModel;
  personalNote: PersonalNoteModel;
  event: PersonalNoteModel;
};

export function setModel(server: MyServer): void {
  server.model = server.model || {};
  server.model.contact = new ContactModel(server.gateways);
  server.model.human = server.model.contact;
  server.model.personalNote = new PersonalNoteModel(server.gateways);
  server.model.event = server.model.personalNote;
}
