import React, { Fragment, useState, useRef } from 'react';
import Head from 'next/head';
import atob from 'atob';
import { RechargeSelect } from '@nacelle/react-recharge';
import { Image, Button } from '@nacelle/react-components';

import product from '../data/product';
import * as styles from '../styles/pages.styles';

const Home = () => {
  const [cart, setCart] = useState([]);
  const itemMetafields = useRef([]);
  const selectedVariantId = product.variants[0].id;
  const selectedVariant = product.variants.find(
    ({ id }) => id === selectedVariantId
  );
  const variantPrice = itemMetafields.current.length
    ? determineVariantPrice(product, selectedVariant)
    : selectedVariant.price;

  const isInCart = cart.findIndex((item) => item.productId === product.id) > -1;

  const addItemToCart = () => {
    const cartItem = {
      image: product.featuredMedia,
      title: product.title,
      variant: {
        ...selectedVariant,
        price: variantPrice
      },
      quantity: 1,
      productId: product.id,
      handle: product.handle,
      vendor: product.vendor,
      tags: product.tags,
      metafields: [...product.metafields, itemMetafields]
    };

    return setCart((currentCart) => [...currentCart, cartItem]);
  };

  const removeItemFromCart = () => {
    return setCart([]);
  };

  const getCartMetafields = (cartMetafields) => {
    itemMetafields.current = cartMetafields;
  };

  return (
    <Fragment>
      <Head>
        <title>Nacelle Recharge Example</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+Pro:wght@300;400;600&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <main css={styles.main}>
        <article css={styles.productCard}>
          <Image src={product.featuredMedia.src} styles={styles.productImage} />
          <div css={styles.productNameLayout}>
            <h2>{product.title}</h2>
            <h4>{`$${parseInt(product.variants[0].price, 10).toFixed(2)}`}</h4>
          </div>
          <Button
            styles={styles.button}
            fullwidth
            onClick={addItemToCart}
            disabled={isInCart}
          >
            ADD TO CART
          </Button>
          <RechargeSelect
            product={product}
            getCartMetafields={getCartMetafields}
          />
        </article>
        <section css={styles.cart}>
          <div css={styles.cartTitle}>
            <h2>Cart</h2>
          </div>
          <div css={styles.cartItems}>
            {cart.map((item) => (
              <article key={item.productId} css={styles.cartItem}>
                <div css={styles.cartItemInfo}>
                  <h3>{item.title}</h3>
                  <span>{`$${parseInt(variantPrice, 10).toFixed(2)}`}</span>
                </div>
                <Button
                  styles={styles.removeButton}
                  variant="secondary"
                  type="button"
                  onClick={removeItemFromCart}
                >
                  REMOVE
                </Button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Fragment>
  );
};

function determineVariantPrice(product, selectedVariant) {
  const [, variantId] = atob(selectedVariant.id).split(
    'gid://shopify/ProductVariant/'
  );
  const [, productId] = atob(product.pimSyncSourceProductId).split(
    'gid://shopify/Product/'
  );

  const priceVariantMap = product.metafields.find(
    ({ key }) => key === 'original_to_hidden_variant_map'
  );

  if (!priceVariantMap) {
    return selectedVariant.price;
  }

  const parsedPriceMap = JSON.parse(priceVariantMap.value);
  const discountPrices = parsedPriceMap[productId];

  if (discountPrices.discount_variant_id === variantId) {
    return discountPrices.discount_variant_price;
  }

  return selectedVariant.price;
}

export default Home;
