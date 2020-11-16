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

@Resolver()
export class EmailTemplateResolver {
  @Authorized()
  @Query(() => [EmailTemplate])
  async emailTemplates(
    @Ctx() { model: { emailTemplate } }: IContext
  ): Promise<Array<EmailTemplate>> {
    return emailTemplate.find({});
  }

  @Authorized()
  @Mutation(() => EmailTemplate, { nullable: true })
  async upsertEmailTemplate(
    @Args() args: UpsertEmailTemplateRequest,
    @Ctx() { model: { emailTemplate } }: IContext
  ): Promise<EmailTemplate | null> {
    return emailTemplate.findOneAndUpdate(
      { id: args.id },
      { ...args },
      { upsert: true }
    );
  }

  @Authorized()
  @Mutation(() => String)
  async send(
    @Args() args: SendRequest,
    @Ctx() { service: { emailTemplateService } }: IContext
  ): Promise<string> {
    await emailTemplateService.send(args);
    return "OK";
  }

  @Authorized()
  @Query(() => String)
  async renderHtml(
    @Args() args: SendRequest,
    @Ctx() { service: { emailTemplateService } }: IContext
  ): Promise<string> {
    return emailTemplateService.renderHtml(args);
  }
}
