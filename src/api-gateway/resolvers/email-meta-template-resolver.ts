import { IContext } from "@/api-gateway/api-gateway";
import { AuthenticationError } from "apollo-server-errors";
import {
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  ID,
  ObjectType,
  Query,
} from "type-graphql";

@ObjectType()
class EmailMetaTemplate {
  @Field(() => String)
  logoUrl: string;
}

@ArgsType()
class EmailMetaTemplatesArgs {
  @Field(() => ID)
  userId: string;
}

export class EmailMetaTemplateResolver {
  @Authorized()
  @Query(() => EmailMetaTemplate)
  async emailMetaTemplates(
    @Args() args: EmailMetaTemplatesArgs,
    @Ctx() { userId, service: { azureSas } }: IContext
  ): Promise<EmailMetaTemplate> {
    if (String(args.userId) !== String(userId)) {
      throw new AuthenticationError("cannot update for someone else");
    }
    return {
      logoUrl: azureSas.getRwcUrl("carrier", `${userId}/logo`),
    };
  }
}
