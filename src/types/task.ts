export type TTask = {
  id?: string;
  title: string;
  ownerId: string;
  rrule?: string;
  due?: Date;
  contacts?: Array<string>;
  done?: Date;
  delayed?: Date;
};
