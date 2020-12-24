import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({ options: { customName: "email_meta_templates" } })
export class EmailMetaTemplateDoc extends TimeStamps {
  @prop({ unique: true })
  id: string;

  @prop()
  owner: string;

  @prop()
  logoUrl: string;
}

export const EmailMetaTemplate = getModelForClass(EmailMetaTemplateDoc);
