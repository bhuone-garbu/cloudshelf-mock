import { gql } from '@apollo/client';

interface PriceRange {
  minVariantPrice: {
    amount: string;
  };
}

interface ImageEdge {
  node: {
    originalSrc: string;
  };
}

interface ProductEdge {
  cursor: string;
  node: Product;
}

interface Product {
  id: string;
  title: string;
  images: {
    edges: ImageEdge[];
  };
  priceRange: PriceRange;
}

interface PageInfo {
  hasNextPage: boolean;
}

export interface ShopifyProductResponse {
  edges: ProductEdge[];
  pageInfo?: PageInfo;
}

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        # hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          title
          images(first: 1) {
            edges {
              node {
                originalSrc
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
            }
            # maxVariantPrice {
            #   amount
            # }
          }
        }
      }
    }
  }
`;
