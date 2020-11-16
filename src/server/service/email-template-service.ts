import { getGeneralEmailCanaotes } from "@/server/service/general-email-canaotes";
import { EmailTemplateModel } from "@/model/email-template-model";
import { ValidationError } from "apollo-server-koa";
import sgMail from "@sendgrid/mail";
import mjml2html from "mjml";
import { getEnvVar } from "onefx/lib/env-var";

export function formatString(
  str?: string,
  data?: Record<string, string | undefined>
): string {
  if (!str || !data) {
    return str || "";
  }

  let processed = str;
  Object.keys(data).forEach((key) => {
    processed = processed.replace(`\${${key}}`, data[key] || "");
  });

  return processed || "";
}

export function wrapMjmlLines(hydrated = ""): string {
  const wrapLine = (line: string): string =>
    `
    <mj-section padding-bottom="0px">
      <mj-column>
        <mj-text>
          <p>
          ${line}
          </p>
        </mj-text>
      </mj-column>
    </mj-section>
`;
  const lines = hydrated.split("\n\n");
  return lines.map((l) => wrapLine(l)).join("\n\n");
}

export function parseCta(
  cta = ""
): { content: string | null; href: string | null } {
  const match = new RegExp(/\[(.*)\]\((.*)\)/).exec(cta);
  return {
    content: match && match[1],
    href: match && match[2],
  };
}

export function mjmlCta(cta: {
  content: string | null;
  href: string | null;
}): string {
  return `
    <mj-section>
      <mj-column width="100%">
        <mj-button align="left" href="${cta.href}">
          ${cta.content}
        </mj-button>
      </mj-column>
    </mj-section>`;
}

type EmailTemplate = {
  subject: string;
  mainContent?: string;
  mainCta?: string;
  secondaryContent?: string;
  secondaryCta?: string;
};

type DataPayload = {
  subject: string;
  mainContent?: string;
  mainCta?: string;
  secondaryContent?: string;
  secondaryCta?: string;
};

export function buildMjml(
  template: EmailTemplate,
  dataPayload: DataPayload
): string {
  const hydratedPayload = {
    subject: formatString(template.subject, dataPayload),
    mainContent: wrapMjmlLines(formatString(template.mainContent, dataPayload)),
    mainCta: mjmlCta(parseCta(formatString(template.mainCta, dataPayload))),
    secondaryContent: wrapMjmlLines(
      formatString(template.secondaryContent, dataPayload)
    ),
    secondaryCta: formatString(template.secondaryCta, dataPayload),
  };
  return getGeneralEmailCanaotes(hydratedPayload);
}

type Deps = {
  model: { emailTemplate: typeof EmailTemplateModel };
  gateways: {
    sgMail: typeof sgMail;
  };
};

type SendArgs = {
  templateId: string;

  email: string;

  idempotencyKey: string;

  payload: Record<string, unknown>;
};

export class EmailTemplateService {
  deps: Deps;

  constructor(deps: Deps) {
    this.deps = deps;
  }

  async send(args: SendArgs): Promise<void> {
    const template = await this.deps.model.emailTemplate.findOne({
      id: args.templateId,
    });
    if (!template) {
      throw new ValidationError("invalid templateId");
    }
    this.deps.gateways.sgMail.setApiKey(getEnvVar("SENDGRID_API_TOKEN", ""));
    await this.deps.gateways.sgMail.send({
      to: args.email,
      from: { email: template.fromEmail, name: "daommo.com" },
      subject: template.subject,
      html: mjml2html(buildMjml(template, args.payload as DataPayload)).html,
      text: template.plainTextBody,
    });
  }

  async renderHtml(args: SendArgs): Promise<string> {
    const template = await this.deps.model.emailTemplate.findOne({
      id: args.templateId,
    });
    if (!template) {
      throw new ValidationError("invalid templateId");
    }
    return mjml2html(buildMjml(template, args.payload as DataPayload)).html;
  }
}