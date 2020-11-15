import { ApolloServer } from "apollo-server-koa";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { MyServer } from "@/server/start-server";
import { OnefxAuth } from "onefx-auth";
import { Gateways } from "@/server/gateway/gateway";
import { Model } from "@/model";
import { EmailTemplateResolver } from "@/api-gateway/resolvers/email-template-resolver";
import { Service } from "@/server/service/service";
import { MetaResolver } from "./resolvers/meta-resolver";

export interface IContext {
  userId: string;
  session: any;
  model: Model;
  gateways: Gateways;
  auth: OnefxAuth;
  reqHeaders: Record<string, string>;
  origin: string;
  service: Service;
}

export async function setApiGateway(server: MyServer): Promise<void> {
  const resolvers = [MetaResolver, EmailTemplateResolver];
  server.resolvers = resolvers;

  const sdlPath = path.resolve(__dirname, "api-gateway.graphql");
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: {
      path: sdlPath,
      commentDescriptions: true,
    },
    validate: false,
  });

  const apollo = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context: async ({ ctx }): Promise<IContext> => {
      const token = server.auth.tokenFromCtx(ctx);
      const userId = await server.auth.jwt.verify(token);

      return {
        userId,
        session: ctx.session,
        model: server.model,
        gateways: server.gateways,
        service: server.service,
        auth: server.auth,
        reqHeaders: ctx.headers,
        origin: ctx.origin,
      };
    },
  });
  const gPath = `${server.config.server.routePrefix || ""}/api-gateway/`;
  apollo.applyMiddleware({ app: server.app, path: gPath });
}
