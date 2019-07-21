import { MyServer } from "../server/start-server";
import { ContactModel } from "./contact-model";
import { PersonalNoteModel } from "./personal-note-model";

export function setModel(server: MyServer): void {
  server.model = server.model || {};
  server.model.contact = new ContactModel(server.gateways);
  server.model.personalNote = new PersonalNoteModel(server.gateways);
}
