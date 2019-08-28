import { ApolloServer } from "apollo-server-koa";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { Model } from "../model";
import { Gateways } from "../server/gateway/gateway";
import { MyServer } from "../server/start-server";
import { ArticleResolver } from "../shared/article/article-resolver";
import { OnefxAuth } from "../shared/onefx-auth";
import { ContactResolver } from "./resolvers/contact-resolver";
import { MetaResolver } from "./resolvers/meta-resolver";

export type Context = {
  model: Model;
  gateways: Gateways;
  userId: string;
  auth: OnefxAuth;
};

export async function setApiGateway(server: MyServer): Promise<void> {
  const resolvers = [MetaResolver, ArticleResolver, ContactResolver];
  server.resolvers = resolvers;

  const sdlPath = path.resolve(__dirname, "api-gateway.graphql");
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: {
      path: sdlPath,
      commentDescriptions: true
    },
    validate: false
  });

  const apollo = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context: async ({ ctx }): Promise<Context> => {
      const token = server.auth.tokenFromCtx(ctx);
      const userId = await server.auth.jwt.verify(token);
      return {
        userId,
        model: server.model,
        gateways: server.gateways,
        auth: server.auth
      };
    }
  });
  const gPath = "/api-gateway/";
  apollo.applyMiddleware({ app: server.app, path: gPath });
}
