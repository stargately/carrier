import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { UserModel, TUser as User } from "onefx-auth/lib/model/user-model";
import { Schema } from "mongoose";

@modelOptions({ options: { customName: "email_templates" } })
export class EmailTemplateDoc extends TimeStamps {
  @prop({ unique: true })
  id: string;

  @prop()
  description: string;

  @prop({ ref: UserModel, required: false })
  owner: Ref<User>;

  @prop()
  fromEmail: string;

  @prop()
  replyToEmail: string;

  @prop()
  subject: string;

  @prop()
  plainTextBody: string;

  @prop()
  mainContent: string;

  @prop()
  mainCta: string;

  @prop()
  secondaryContent: string;

  @prop()
  secondaryCta: string;

  @prop({
    type: Schema.Types.Map,
    of: String,
  })
  exampleDataPayload: Record<string, unknown>;
}

export const EmailTemplateModel = getModelForClass(EmailTemplateDoc);
