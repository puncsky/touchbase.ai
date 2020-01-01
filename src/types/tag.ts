export interface TTagTemplate {
  id?: string;
  name: string;
  ownerId: string;
  hasRate: boolean;
}

export interface TTag {
  id?: string;
  rate: number;
  templateId: string;
  contactId: string;
  name: string;
  ownerId: string;
  hasRate: boolean;
}
