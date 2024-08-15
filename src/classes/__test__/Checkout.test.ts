import { APPLE_TV, MACBOOK_PRO, SUPER_IPAD, VGA_ADAPTER } from '../../data/catalog';
import getPricingRules from '../../data/getPricingRules';
import Checkout from '../Checkout';

describe('Checkout', () => {
  let checkout: Checkout;

  beforeEach(() => {
    checkout = new Checkout(getPricingRules());
  });

  describe('list()', () => {
    it('should return a list of products that have been scanned', () => {
      const product_1 = APPLE_TV;
      const product_2 = SUPER_IPAD;

      const expected = [product_1, product_2]

      checkout.scan(product_1);
      checkout.scan(product_2);

      const products = checkout.list();
      expect(products).toHaveLength(2);

      expected.forEach(expectedProduct => {
        expect(products).toContainEqual(expectedProduct);
      });
    });

    it('should return a list of products with a VGA since a macos has been scaned', () => {
      const product_1 = APPLE_TV;
      const product_2 = MACBOOK_PRO;
      const product_3: Product = { ...VGA_ADAPTER, price: 0 }

      const expected = [product_1, product_2, product_3]

      checkout.scan(product_1);
      checkout.scan(product_2);

      const products = checkout.list();

      expect(products).toHaveLength(3);

      expected.forEach(expectedProduct => {
        expect(products).toContainEqual(expectedProduct);
      });
    });

    it('should return a list of products with one VGA for each macos scanned', () => {
      const product_1 = APPLE_TV;
      const product_2 = MACBOOK_PRO;
      const product_3: Product = { ...VGA_ADAPTER, price: 0 }

      const expected = [product_1, product_2, product_2, product_2, product_3, product_3, product_3]

      checkout.scan(product_1);
      checkout.scan(product_2);
      checkout.scan(product_2);
      checkout.scan(product_2);

      const products = checkout.list();
      expect(products).toHaveLength(7);
      expected.forEach(expectedProduct => {
        expect(products).toContainEqual(expectedProduct);
      });
    });
  })

  describe('Instance check', () => {
    it('should create a new Checkout instance', () => {
      const checkout = new Checkout(getPricingRules());
      expect(checkout).toBeInstanceOf(Checkout);
    });
  })

  describe('total() - No Discount', () => {
    it('should return the total correctly for products with no discounts associated', () => {
      const product_1 = APPLE_TV
      const product_2 = SUPER_IPAD

      checkout.scan(product_1);
      checkout.scan(product_2);

      const total = checkout.total();
      expect(total).toEqual(659.49);
    });
  })

  describe('total() - XforY Discount', () => {
    it('should check if product Apple TV will get discounted if there is more than the minimum required quantity', () => {
      const product_A = APPLE_TV;
      const product_A_1 = APPLE_TV;
      const product_A_2 = APPLE_TV;
      const product_G = SUPER_IPAD

      checkout.scan(product_A);
      checkout.scan(product_A_1);
      checkout.scan(product_A_2);
      checkout.scan(product_G);

      const total = checkout.total();
      expect(total).toEqual(768.99);
    })

    it('should check if product Apple TV will get discounted multiple times if eligible', () => {
      const product_A = APPLE_TV;
      const product_A_1 = APPLE_TV;
      const product_A_2 = APPLE_TV;
      const product_A_3 = APPLE_TV;
      const product_A_4 = APPLE_TV;
      const product_A_5 = APPLE_TV;
      const product_G = SUPER_IPAD

      checkout.scan(product_A);
      checkout.scan(product_A_1);
      checkout.scan(product_A_2);
      checkout.scan(product_A_3);
      checkout.scan(product_A_4);
      checkout.scan(product_A_5);
      checkout.scan(product_G);

      const total = checkout.total();
      expect(total).toEqual(987.99);
    })

    it('should check if product Apple TV will get discounted if there is less than the minimum required quantity', () => {
      const product_A = APPLE_TV;
      const product_A_1 = APPLE_TV;
      const product_G = SUPER_IPAD;

      checkout.scan(product_A);
      checkout.scan(product_A_1);
      checkout.scan(product_G);

      const total = checkout.total();
      expect(total).toEqual(768.99);
    })
  })

  describe('total() - DiscountOverQuantity Discount', () => {
    it('should check if product Super IPad will get discounted if there is more than the minimum required quantity', () => {
      const product_B = SUPER_IPAD;
      const product_B_1 = SUPER_IPAD;
      const product_B_2 = SUPER_IPAD;
      const product_B_3 = SUPER_IPAD;
      const product_B_4 = SUPER_IPAD;
      const product_G = APPLE_TV;

      checkout.scan(product_B);
      checkout.scan(product_B_1);
      checkout.scan(product_B_2);
      checkout.scan(product_B_3);
      checkout.scan(product_B_4);
      checkout.scan(product_G);

      const total = checkout.total();
      expect(total).toEqual(2609.45);
    })

    it('should check if product Super IPad will get discounted if there is less than the minimum required quantity', () => {
      const product_B = SUPER_IPAD;
      const product_B_1 = SUPER_IPAD;
      const product_B_2 = SUPER_IPAD;
      const product_B_3 = SUPER_IPAD;
      const product_G = APPLE_TV;

      checkout.scan(product_B);
      checkout.scan(product_B_1);
      checkout.scan(product_B_2);
      checkout.scan(product_B_3);
      checkout.scan(product_G);

      const total = checkout.total();
      expect(total).toEqual(2309.46);
    })
  })

  describe('total() - Bundle Discount', () => {
    it('should check if VGA will not be charged when there is a macbook', () => {
      const product_C = MACBOOK_PRO
      const product_G = APPLE_TV

      checkout.scan(product_C);
      checkout.scan(product_G);

      const total = checkout.total();
      expect(total).toEqual(1509.49);
    })

    it('should check if VGA wont be charges regardless of how many Macos are added', () => {
      const product_C = MACBOOK_PRO;
      const product_G = MACBOOK_PRO

      checkout.scan(product_C);
      checkout.scan(product_G);

      const total = checkout.total();
      expect(total).toEqual(2799.98);
    })
  })
});