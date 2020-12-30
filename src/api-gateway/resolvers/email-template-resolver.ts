import {
  ID,
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Authorized,
} from "type-graphql";
import { EmailTemplateDoc } from "@/model/email-template-model";
import { IContext } from "@/api-gateway/api-gateway";
import { GraphQLJSONObject } from "graphql-type-json";
import { AuthenticationError, ValidationError } from "apollo-server-errors";
import { ApiTokensDoc } from "@/shared/api-tokens/api-tokens-model";

@ObjectType()
class EmailTemplate extends EmailTemplateDoc {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: true })
  fromEmail: string;

  @Field(() => String, { nullable: true })
  replyToEmail: string;

  @Field(() => String, { nullable: true })
  subject: string;

  @Field(() => String, { nullable: true })
  plainTextBody: string;

  @Field(() => String, { nullable: true })
  mainContent: string;

  @Field(() => String, { nullable: true })
  mainCta: string;

  @Field(() => String, { nullable: true })
  secondaryContent: string;

  @Field(() => String, { nullable: true })
  secondaryCta: string;
}

@ArgsType()
class UpsertEmailTemplateRequest extends EmailTemplateDoc {
  @Field(() => String)
  id: string;

  @Field(() => String)
  description: string;

  @Field(() => String, { nullable: true })
  fromEmail: string;

  @Field(() => String, { nullable: true })
  replyToEmail: string;

  @Field(() => String, { nullable: true })
  subject: string;

  @Field(() => String, { nullable: true })
  plainTextBody: string;

  @Field(() => String, { nullable: true })
  mainContent: string;

  @Field(() => String, { nullable: true })
  mainCta: string;

  @Field(() => String, { nullable: true })
  secondaryContent: string;

  @Field(() => String, { nullable: true })
  secondaryCta: string;
}

@ArgsType()
class SendRequest {
  @Field(() => String)
  templateId: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  idempotencyKey: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  payload: Record<string, unknown>;
}

@ArgsType()
class RenderRequest {
  @Field(() => String)
  templateId: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  payload: Record<string, unknown>;
}

@ArgsType()
class ExampleDataPayloadRequest {
  @Field(() => ID)
  templateId: string;
}

@ArgsType()
class UpdateExampleDataPayloadRequest {
  @Field(() => ID)
  templateId: string;

  @Field(() => GraphQLJSONObject)
  exampleDataPayload: Record<string, unknown>;
}

@Resolver()
export class EmailTemplateResolver {
  @Authorized()
  @Query(() => [EmailTemplate])
  async emailTemplates(
    @Ctx() { model: { emailTemplate }, userId }: IContext
  ): Promise<Array<EmailTemplate>> {
    return emailTemplate.find({ owner: userId });
  }

  @Authorized()
  @Mutation(() => EmailTemplate, { nullable: true })
  async upsertEmailTemplate(
    @Args() args: UpsertEmailTemplateRequest,
    @Ctx() { model: { emailTemplate }, userId }: IContext
  ): Promise<EmailTemplate | null> {
    return emailTemplate.findOneAndUpdate(
      { id: args.id },
      { ...args, owner: userId },
      { upsert: true }
    );
  }

  @Mutation(() => String)
  async send(
    @Args() args: SendRequest,
    @Ctx()
    {
      service: { emailTemplateService },
      model: { apiTokens },
      userId,
      reqHeaders,
    }: IContext
  ): Promise<string> {
    let found: ApiTokensDoc | null;
    if (userId) {
      found = await apiTokens.findOne({ owner: userId });
    } else {
      const token = String(reqHeaders.authorization).replace("Bearer ", "");
      found = await apiTokens.findOne({ carrierToken: token });
    }
    if (!found) {
      throw new AuthenticationError("invalid carrier token");
    }
    if (!found.sendgridApiKey) {
      throw new ValidationError("please setup sendgrid api key first");
    }
    await emailTemplateService.send(args, found.sendgridApiKey, found.owner);
    return "OK";
  }

  @Authorized()
  @Query(() => String)
  async renderHtml(
    @Args() args: RenderRequest,
    @Ctx() { service: { emailTemplateService }, userId }: IContext
  ): Promise<string> {
    return emailTemplateService.renderHtml(args, userId);
  }

  @Authorized()
  @Query(() => GraphQLJSONObject, { nullable: true })
  async exampleDataPayload(
    @Args() args: ExampleDataPayloadRequest,
    @Ctx() { service: { emailTemplateService }, userId }: IContext
  ): Promise<Record<string, unknown> | undefined> {
    return emailTemplateService.getExampleDataPayload(args.templateId, userId);
  }

  @Authorized()
  @Mutation(() => GraphQLJSONObject, { nullable: true })
  async updateExampleDataPayload(
    @Args() args: UpdateExampleDataPayloadRequest,
    @Ctx() { service: { emailTemplateService }, userId }: IContext
  ): Promise<Record<string, unknown> | undefined> {
    return emailTemplateService.updateExampleDataPayload(
      args.templateId,
      args.exampleDataPayload,
      userId
    );
  }
}
