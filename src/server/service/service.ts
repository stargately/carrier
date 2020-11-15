import { EmailTemplateService } from "@/server/service/email-template-service";
import { MyServer } from "../start-server";

export type Service = {
  emailTemplateService: EmailTemplateService;
};

export function setService(server: MyServer): void {
  server.service = server.service || {};
  server.service.emailTemplateService = new EmailTemplateService(server);
}
