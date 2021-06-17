import React, { useState, useEffect, useRef } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next';

import { apolloClient } from '../apollo-client';
import { GET_PRODUCTS_QUERY, ShopifyProductResponse } from '../queries/get-products';

import styles from '../styles/Home.module.css';

interface GraphQLResponse {
  products: ShopifyProductResponse;
}

interface GraphQLVariables {
  first: number;
  after?: string;
}

const fetchProducts = async (variables: GraphQLVariables) => {
  const { data } = await apolloClient.query<GraphQLResponse, GraphQLVariables>({
    notifyOnNetworkStatusChange: true,
    query: GET_PRODUCTS_QUERY,
    variables,
  });

  return data.products;
};

export const getServerSideProps: GetServerSideProps<ShopifyProductResponse> =
  async () => {
    const products = await fetchProducts({ first: 4 });
    return { props: products };
  };

function App({ edges: initialEdges, pageInfo }: ShopifyProductResponse) {
  const [edges, setEdges] = useState(initialEdges);
  const [hasMore, setHasMore] = useState(pageInfo.hasNextPage);

  const [domRef, setDomRef] = useState(null);
  const observerRef = useRef<IntersectionObserver>(null);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      threshold: 0.2,
    };

    const callback = async ([entry]) => {
      if (entry.isIntersecting) {
        const newProducts = await fetchProducts({
          after: edges[edges.length - 1].cursor,
          first: 4,
        });

        setEdges([...edges, ...newProducts.edges]);
        setHasMore(newProducts.pageInfo.hasNextPage);
      }
    };

    observerRef.current = new IntersectionObserver(callback, options);

    if (domRef) {
      observerRef.current.observe(domRef);
    }

    return () => observerRef.current.disconnect();
  }, [edges, domRef]);

  // styles based on Next.js bootstrapped
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta content="Generated by create next app" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bootstrapped using <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <div className={styles.grid}>
          {edges.map((edge) => (
            <div className={styles.card} key={edge.node.id}>
              <h2>{edge.node.title}</h2>
              <Image
                height={200}
                src={edge.node.images.edges[0].node.originalSrc}
                width={200}
              />
              <p>£{edge.node.priceRange.minVariantPrice.amount}</p>
            </div>
          ))}
        </div>
        {hasMore && <div ref={setDomRef} />}
      </main>
    </div>
  );
}

export default App;