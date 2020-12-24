import { EmailTemplateService } from "@/server/service/email-template-service";
import { AzureSasService } from "@/server/service/azure-sas";
import { MyServer } from "../start-server";

export type Service = {
  azureSas: AzureSasService;
  emailTemplateService: EmailTemplateService;
};

export function setService(server: MyServer): void {
  server.service = server.service || {};
  server.service.emailTemplateService = new EmailTemplateService(server);
  server.service.azureSas = new AzureSasService(server.config.service.azureSas);
}
