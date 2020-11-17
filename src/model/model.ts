import { MyServer } from "@/server/start-server";
import { EmailTemplateModel } from "@/model/email-template-model";
import { ApiTokensModel } from "@/shared/api-tokens/api-tokens-model";

export type Model = {
  emailTemplate: typeof EmailTemplateModel;
  apiTokens: typeof ApiTokensModel;
};

export function setModel(server: MyServer): void {
  server.model = server.model || {};
  server.model.emailTemplate = EmailTemplateModel;
  server.model.apiTokens = ApiTokensModel;
}
