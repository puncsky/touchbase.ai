import { MyServer } from "../server/start-server";
import { ContactModel } from "./contact-model";
import { PersonalNoteModel } from "./personal-note-model";
import { TagModel } from "./tag-model";
import { TaskModel } from "./task-model";

export type Model = {
  contact: ContactModel;
  human: ContactModel;
  personalNote: PersonalNoteModel;
  event: PersonalNoteModel;
  tag: TagModel;
  task: TaskModel;
};

export function setModel(server: MyServer): void {
  server.model = server.model || {};
  server.model.contact = new ContactModel(server.gateways);
  server.model.human = server.model.contact;
  server.model.personalNote = new PersonalNoteModel(server.gateways);
  server.model.event = server.model.personalNote;
  server.model.tag = new TagModel(server.gateways);
  server.model.task = new TaskModel(server.gateways);
}
