import { MyServer } from "@/server/start-server";
import { EmailTemplateModel } from "@/model/email-template-model";
import { ApiTokensModel } from "@/shared/api-tokens/api-tokens-model";
import { EmailMetaTemplate } from "@/model/email-meta-template-model";

export type Model = {
  emailTemplate: typeof EmailTemplateModel;
  apiTokens: typeof ApiTokensModel;
  emailMetaTemplate: typeof EmailMetaTemplate;
};

export function setModel(server: MyServer): void {
  server.model = server.model || {};
  server.model.emailTemplate = EmailTemplateModel;
  server.model.apiTokens = ApiTokensModel;
  server.model.emailMetaTemplate = EmailMetaTemplate;
}
