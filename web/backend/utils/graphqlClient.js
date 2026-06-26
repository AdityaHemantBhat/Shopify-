import shopify from "../shopify.js";
import logger from "./logger.js";

const createGraphQLClient = (session) => {
  const client = new shopify.api.clients.Graphql({ session: session });

  return {
    async query(args) {
      const data = args.data;
      const variables = args.variables;
      
      try {
        console.log("GraphQL Request: " + data.substring(0, 100) + "...");

        const response = await client.request(data, {
          variables: variables,
        });

        console.log("GraphQL Response received successfully");
        return response;
      } catch (error) {
        console.log("GraphQL request failed: " + error.message);
        throw new Error("GraphQL request failed: " + error.message);
      }
    },
  };
}

export default createGraphQLClient;
