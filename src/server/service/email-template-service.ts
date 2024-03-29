import {
  getGeneralEmailCanaotes,
  MetaPayload,
} from "@/server/service/general-email-canaotes";
import { EmailTemplateModel } from "@/model/email-template-model";
import { ValidationError } from "apollo-server-koa";
import sgMail from "@sendgrid/mail";
import mjml2html from "mjml";
import { formatString } from "@/shared/common/format-string";
import { AzureSasService } from "@/server/service/azure-sas";
import { ApiTokensModel } from "@/shared/api-tokens/api-tokens-model";

export function wrapMjmlLines(hydrated = ""): string {
  const wrapLine = (line: string): string =>
    `
    <mj-section padding="0px">
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
): {
  content: string | null;
  href: string | null;
} {
  const match = new RegExp(/\[(.*)\]\((.*)\)/).exec(cta);
  return {
    content: match && match[1],
    href: match && match[2],
  };
}

type Cta = {
  content: string | null;
  href: string | null;
};

export function mjmlCta(
  mainCta: Cta,
  secondaryCta: Cta,
  themeColor: string
): string {
  if (!mainCta.content) {
    return "";
  }
  return `
    <mj-section>
    <mj-group>
      <mj-column css-class="cta-column">
        <mj-button align="left" href="${
          mainCta.href
        }" css-class="main-cta-btn" background-color=${themeColor}>
          ${mainCta.content}
        </mj-button>
      </mj-column>

      ${
        (secondaryCta.content &&
          `<mj-column css-class="cta-column"><mj-button align="left" href="${secondaryCta.href}" background-color="white" color="black" border="solid 1px" css-class="secondary-cta-btn">
        ${secondaryCta.content}
      </mj-button></mj-column>`) ||
        ""
      }
      </mj-group>
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
  themeColor: string,
  dataPayload: DataPayload,
  metaPayload: MetaPayload
): string {
  const hydratedPayload = {
    subject: formatString(template.subject, dataPayload),
    mainContent: wrapMjmlLines(formatString(template.mainContent, dataPayload)),
    cta: mjmlCta(
      parseCta(formatString(template.mainCta, dataPayload)),
      parseCta(formatString(template.secondaryCta, dataPayload)),
      themeColor
    ),
    secondaryContent: wrapMjmlLines(
      formatString(template.secondaryContent, dataPayload)
    ),
  };
  return getGeneralEmailCanaotes(hydratedPayload, metaPayload);
}

type Deps = {
  model: {
    emailTemplate: typeof EmailTemplateModel;
    apiTokens: typeof ApiTokensModel;
  };
  gateways: {
    sgMail: typeof sgMail;
  };
  service: { azureSas: AzureSasService };
};

type SendArgs = {
  templateId: string;

  email: string;

  idempotencyKey: string;

  payload: Record<string, unknown>;
};

type RenderArgs = Pick<SendArgs, "templateId" | "payload">;

export class EmailTemplateService {
  deps: Deps;

  constructor(deps: Deps) {
    this.deps = deps;
  }

  async send(args: SendArgs, sgApiKey: string, userId: string): Promise<void> {
    const template = await this.deps.model.emailTemplate.findOne({
      id: args.templateId,
      owner: userId,
    });
    if (!template) {
      throw new ValidationError("invalid templateId");
    }
    this.deps.gateways.sgMail.setApiKey(sgApiKey);
    const meta = {
      _logo: this.deps.service.azureSas.getLongTermReadUrl(
        "carrier",
        `${userId}/logo`
      ),
    };
    // retrieve themeColor from apiTokens
    const apiTokens = await this.deps.model.apiTokens.findOne({
      owner: userId,
    });
    if (!apiTokens) {
      throw new ValidationError("missing api tokens");
    }
    await this.deps.gateways.sgMail.send({
      to: args.email,
      from: { email: template.fromEmail },
      subject: formatString(template.subject, args.payload as any),
      html: mjml2html(
        buildMjml(
          template,
          apiTokens.themeColor,
          args.payload as DataPayload,
          meta
        )
      ).html,
      text: template.plainTextBody,
    });
  }

  async renderHtml(args: RenderArgs, userId: string): Promise<string> {
    const template = await this.deps.model.emailTemplate.findOne({
      id: args.templateId,
      owner: userId,
    });
    if (!template) {
      throw new ValidationError("invalid templateId");
    }
    const meta = {
      _logo: this.deps.service.azureSas.getLongTermReadUrl(
        "carrier",
        `${userId}/logo`
      ),
    };
    // retrieve themeColor from apiTokens
    const apiTokens = await this.deps.model.apiTokens.findOne({
      owner: userId,
    });
    if (!apiTokens) {
      throw new ValidationError("missing api tokens");
    }
    return mjml2html(
      buildMjml(
        template,
        apiTokens.themeColor,
        args.payload as DataPayload,
        meta
      )
    ).html;
  }

  async getExampleDataPayload(
    id: string,
    userId: string
  ): Promise<Record<string, unknown> | undefined> {
    const res = await this.deps.model.emailTemplate.findOne({
      id,
      owner: userId,
    });
    return res?.exampleDataPayload;
  }

  async updateExampleDataPayload(
    templateId: string,
    exampleDataPayload: Record<string, unknown>,
    userId: string
  ): Promise<Record<string, unknown> | undefined> {
    const resp = await this.deps.model.emailTemplate.findOneAndUpdate(
      { id: templateId, owner: userId },
      { exampleDataPayload }
    );
    return resp?.exampleDataPayload;
  }
}
