import { APPLE_TV, MACBOOK_PRO, SUPER_IPAD, VGA_ADAPTER } from '../../data/catalog';
import getPricingRules from '../../data/getPricingRules';
import Product from '../../types/Product';
import DiscountCalculator from '../DiscountCalculator';

const DISCOUNTED_VGA_ADAPTER: Product = { ...VGA_ADAPTER, price: 0 }
const DISCOUNTED_APPLE_TV: Product = { ...APPLE_TV, price: 0 }
const DISCOUNTED_SUPER_IPAD: Product = { ...SUPER_IPAD, price: 499.99 }



describe('DiscountCalculator', () => {
  let discountCalculator: DiscountCalculator;
  const pricingRules = getPricingRules()

  beforeEach(() => {
    discountCalculator = new DiscountCalculator();
  });

  describe('applyDiscounts() - No Discount', () => {
    it('should apply no discount', () => {
      let result: Product[] = []
      const products: Product[] = [
        MACBOOK_PRO,
        APPLE_TV,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = MACBOOK_PRO;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        MACBOOK_PRO,
        APPLE_TV,
        MACBOOK_PRO,
      ]

      expect(result).toEqual(expected);
    });
  })

  describe('applyDiscounts() - Bundle Discount', () => {
    it('should apply bundle discount when the added product matches the bundle discount product', () => {
      let result: Product[] = []
      const products: Product[] = [
        VGA_ADAPTER,
        APPLE_TV,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = MACBOOK_PRO;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        DISCOUNTED_VGA_ADAPTER,
        APPLE_TV,
        MACBOOK_PRO,
      ]

      expect(result).toEqual(expected);
    });

    it('should apply bundle discount when the added product matches the bundle additional product', () => {
      let result: Product[] = []
      const products: Product[] = [
        MACBOOK_PRO,
        APPLE_TV,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = VGA_ADAPTER;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        MACBOOK_PRO,
        APPLE_TV,
        DISCOUNTED_VGA_ADAPTER,
      ]

      expect(result).toEqual(expected);
    });

    it('should apply bundle discount when the added product matches the bundle additional product regardless the order', () => {
      let result: Product[] = []
      const products: Product[] = [
        MACBOOK_PRO,
        MACBOOK_PRO,
        MACBOOK_PRO,
        APPLE_TV,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = VGA_ADAPTER;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        MACBOOK_PRO,
        MACBOOK_PRO,
        MACBOOK_PRO,
        APPLE_TV,
        DISCOUNTED_VGA_ADAPTER,
      ]

      expect(result).toEqual(expected);
    });

    it('should apply bundle discount to each mac and vga match', () => {
      let result: Product[] = []
      const products: Product[] = [
        MACBOOK_PRO,
        MACBOOK_PRO,
        VGA_ADAPTER,
        MACBOOK_PRO,
        APPLE_TV,
        VGA_ADAPTER,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = VGA_ADAPTER;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        MACBOOK_PRO,
        MACBOOK_PRO,
        DISCOUNTED_VGA_ADAPTER,
        MACBOOK_PRO,
        APPLE_TV,
        DISCOUNTED_VGA_ADAPTER,
        DISCOUNTED_VGA_ADAPTER
      ]

      expect(result).toEqual(expected);
    });
  })

  describe('applyDiscounts() - XforY Discount', () => {
    it('should not apply any discounts because the product qtd is lower than minimum required to be eligible', () => {
      let result: Product[] = []
      const products: Product[] = [
        APPLE_TV,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = APPLE_TV;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        APPLE_TV,
        APPLE_TV
      ]

      expect(result).toEqual(expected);
    });

    it('should apply discounts because the product qtd is equals the minimum required to be eligible', () => {
      let result: Product[] = []
      const products: Product[] = [
        APPLE_TV,
        APPLE_TV,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = APPLE_TV;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        APPLE_TV,
        APPLE_TV,
        DISCOUNTED_APPLE_TV
      ]

      expect(result).toEqual(expected);
    });

    it('should apply discounts because the product qtd is larger the minimum required to be eligible', () => {
      let result: Product[] = []
      const products: Product[] = [
        APPLE_TV,
        APPLE_TV,
        APPLE_TV,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = APPLE_TV;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        APPLE_TV,
        APPLE_TV,
        DISCOUNTED_APPLE_TV,
        APPLE_TV,
      ]

      expect(result).toEqual(expected);
    });

    it('should apply discounts twice because the product qtd is twice the minimum required to be eligible', () => {
      let result: Product[] = []
      const products: Product[] = [
        APPLE_TV,
        APPLE_TV,
        APPLE_TV,
        APPLE_TV,
        APPLE_TV,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = APPLE_TV;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        APPLE_TV,
        APPLE_TV,
        DISCOUNTED_APPLE_TV,
        APPLE_TV,
        APPLE_TV,
        DISCOUNTED_APPLE_TV
      ]

      expect(result).toEqual(expected);
    });
  })

  describe('applyDiscounts() - DiscountOverQuantity Discount', () => {
    it('should not apply any discounts because the product qtd is lower than minimum required to be eligible', () => {
      let result: Product[] = []
      const products: Product[] = [
        SUPER_IPAD,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = SUPER_IPAD;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        SUPER_IPAD,
        SUPER_IPAD
      ]

      expect(result).toEqual(expected);
    })

    it('should not apply any discounts because the product qtd is equals than minimum required to be eligible', () => {
      let result: Product[] = []
      const products: Product[] = [
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = SUPER_IPAD;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD
      ]

      expect(result).toEqual(expected);
    })

    it('should not apply any discounts because the product qtd is over than minimum required to be eligible', () => {
      let result: Product[] = []
      const products: Product[] = [
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = SUPER_IPAD;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD
      ]

      expect(result).toEqual(expected);
    })
  })

  describe('applyDiscounts() - Multiple Discounts', () => {
    it('should apply discount to the Apple TVs and make the VGA free of charge', () => {
      let result: Product[] = []
      const products: Product[] = [
        MACBOOK_PRO,
        APPLE_TV,
        APPLE_TV,
        VGA_ADAPTER
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = APPLE_TV;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        MACBOOK_PRO,
        APPLE_TV,
        APPLE_TV,
        DISCOUNTED_VGA_ADAPTER,
        DISCOUNTED_APPLE_TV,
      ]


      expect(result).toEqual(expected);
    })

    it('should apply discount to the Apple TVs and Super Ipads', () => {
      let result: Product[] = []
      const products: Product[] = [
        SUPER_IPAD,
        APPLE_TV,
        APPLE_TV,
        SUPER_IPAD,
        APPLE_TV,
        SUPER_IPAD,
        SUPER_IPAD,
        APPLE_TV
      ];

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = SUPER_IPAD;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        DISCOUNTED_SUPER_IPAD,
        APPLE_TV,
        APPLE_TV,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_APPLE_TV,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        APPLE_TV,
        DISCOUNTED_SUPER_IPAD
      ]

      expect(result).toEqual(expected);
    })

    it('should apply discount to the Super Ipads and 2 make VGA Free of Charge but one should be charged', () => {
      let result: Product[] = []
      const products: Product[] = [
        SUPER_IPAD,
        MACBOOK_PRO,
        VGA_ADAPTER,
        SUPER_IPAD,
        MACBOOK_PRO,
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
        VGA_ADAPTER,
      ]

      for (const product of products) {
        result = discountCalculator.applyDiscounts([...result, product], product, pricingRules);
      }

      const productAdded: Product = VGA_ADAPTER;
      result = discountCalculator.applyDiscounts([...result, productAdded], productAdded, pricingRules);

      const expected = [
        DISCOUNTED_SUPER_IPAD,
        MACBOOK_PRO,
        DISCOUNTED_VGA_ADAPTER,
        DISCOUNTED_SUPER_IPAD,
        MACBOOK_PRO,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_SUPER_IPAD,
        DISCOUNTED_VGA_ADAPTER,
        VGA_ADAPTER
      ]

      expect(result).toEqual(expected);
    })
  })
});