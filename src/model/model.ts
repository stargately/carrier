import { MyServer } from "@/server/start-server";
import { EmailTemplateModel } from "@/model/email-template-model";

export type Model = {
  emailTemplate: typeof EmailTemplateModel;
};

export function setModel(server: MyServer): void {
  server.model = server.model || {};
  server.model.emailTemplate = EmailTemplateModel;
}
