import createGraphQLClient from "../utils/graphqlClient.js";
import logger from "../utils/logger.js";

const METAFIELDS_SET_MUTATION = `
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
        type
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const SHOP_QUERY = `
  query ShopInfo {
    shop {
      id
      name
      myshopifyDomain
    }
  }
`;

const SHOP_METAFIELD_QUERY = `
  query ShopMetafield($namespace: String!, $key: String!) {
    shop {
      metafield(namespace: $namespace, key: $key) {
        id
        namespace
        key
        value
        type
        updatedAt
      }
    }
  }
`;

const getShopId = async (session) => {
  const client = createGraphQLClient(session);

  const response = await client.query({ data: SHOP_QUERY });
  const shopId = response.data.shop.id;

  console.log("Shop GID resolved: " + shopId);
  return shopId;
}

const setAnnouncementMetafield = async (session, text) => {
  const client = createGraphQLClient(session);

  const shopId = await getShopId(session);

  console.log("Setting announcement metafield for shop " + session.shop);

  const response = await client.query({
    data: METAFIELDS_SET_MUTATION,
    variables: {
      metafields: [
        {
          ownerId: shopId,
          namespace: "my_app",
          key: "announcement",
          type: "single_line_text_field",
          value: text,
        },
      ],
    },
  });

  const metafields = response.data.metafieldsSet.metafields;
  const userErrors = response.data.metafieldsSet.userErrors;

  if (userErrors != undefined && userErrors.length > 0) {
    const errorMessages = userErrors.map((e) => e.message).join(", ");
    console.log("Metafield mutation userErrors: " + errorMessages);
    throw new Error("Shopify metafield error: " + errorMessages);
  }

  console.log("Announcement metafield set successfully");
  return metafields[0];
}

const getAnnouncementMetafield = async (session) => {
  const client = createGraphQLClient(session);

  const response = await client.query({
    data: SHOP_METAFIELD_QUERY,
    variables: {
      namespace: "my_app",
      key: "announcement",
    },
  });

  const metafield = response.data.shop.metafield;

  if (metafield == null || metafield == undefined) {
    console.log("No announcement metafield found for shop");
    return null;
  }

  return metafield;
}

const clearAnnouncementMetafield = async (session) => {
  console.log("Clearing announcement metafield for shop " + session.shop);
  return setAnnouncementMetafield(session, "");
}

export {
  setAnnouncementMetafield,
  getAnnouncementMetafield,
  clearAnnouncementMetafield,
  getShopId,
};
