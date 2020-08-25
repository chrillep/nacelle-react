import { renderHook, act } from '@testing-library/react-hooks';
import { useCheckout } from './use-checkout';

const checkoutResponse = {
  data: {
    data: {
      processCheckout: {
        id: 'checkout-id',
        completed: false,
        url: 'https://sample-apparel.myshopify.com/12345/checkouts/checkout-id',
        source: 'Shopify'
      }
    }
  }
};

const items = [
  {
    variant: {
      id: 'my-variant-id',
      qty: 1
    }
  }
];

const credentials = {
  nacelleSpaceId: 'my-space-id',
  nacelleGraphqlToken: 'my-graphql-token'
};

describe('useCheckout', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return checkout data from hail frequency', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(checkoutResponse)
      })
    );

    const { result } = renderHook(() => useCheckout(credentials, items));
    const [, checkout] = result.current;

    expect(result.current[2]).toEqual(false);
    expect(result.current[0]).toEqual(null);

    await act(async () => {
      await checkout();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://hailfrequency.com/v2/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Nacelle-Space-Id': credentials.nacelleSpaceId,
          'X-Nacelle-Space-Token': credentials.nacelleGraphqlToken
        },
        body: expect.any(String)
      }
    );

    expect(result.current[2]).toEqual(false);
    expect(result.current[0]).toEqual(checkoutResponse);
  });
});