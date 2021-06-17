import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const link = new HttpLink({
  headers: {
    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_STORE_KEY,
  },
  uri: 'https://dev-cloudshelf.myshopify.com/api/2021-04/graphql.json',
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
