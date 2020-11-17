import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { UserModel, TUser as User } from "onefx-auth/lib/model/user-model";
import nanoid58 from "nanoid-base58";

@modelOptions({ options: { customName: "api_tokens" } })
export class ApiTokensDoc extends TimeStamps {
  @prop({ default: () => new mongoose.Types.ObjectId() })
  _id?: mongoose.Types.ObjectId;

  @prop({ ref: UserModel, required: true })
  owner: Ref<User> | string;

  @prop()
  sendgridApiKey?: string;

  @prop({ default: () => `carrier_${nanoid58()}` })
  carrierToken?: string;
}

export const ApiTokensModel = getModelForClass(ApiTokensDoc);
