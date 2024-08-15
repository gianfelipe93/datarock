import { APPLE_TV, MACBOOK_PRO, SUPER_IPAD, VGA_ADAPTER } from '../../data/catalog';
import getPricingRules from '../../data/getPricingRules';
import DiscountCalculator from '../DiscountCalculator';

const DISCOUNTED_VGA_ADAPTER = { ...VGA_ADAPTER, price: 0 }

describe('DiscountCalculator', () => {
  let discountCalculator: DiscountCalculator;
  const pricingRules = getPricingRules()

  beforeEach(() => {
    discountCalculator = new DiscountCalculator();
  });

  describe('applyDiscounts()', () => {
    it('should apply bundle discount when the added product matches the bundle discount product', () => {
      const products: Product[] = [
        MACBOOK_PRO,
        APPLE_TV,
      ];
      const productAdded: Product = MACBOOK_PRO;
      const result = discountCalculator.applyDiscounts([...products, productAdded], productAdded, pricingRules);

      expect(result).toEqual([
        MACBOOK_PRO,
        APPLE_TV,
        MACBOOK_PRO,
        DISCOUNTED_VGA_ADAPTER,
      ]);
    });

    it('should apply XforY discount to the products', () => {
      const products: Product[] = [
        APPLE_TV,
        APPLE_TV,
        APPLE_TV,
      ];
      const productAdded: Product = APPLE_TV;

      const result = discountCalculator.applyDiscounts([...products, productAdded], productAdded, pricingRules);

      expect(result).toEqual([
        APPLE_TV,
        APPLE_TV,
        { ...APPLE_TV, price: 0 },
        APPLE_TV,
      ]);
    });

    it('should apply DiscountOverQuantity discount to the products', () => {
      const products: Product[] = [
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
      ];
      const productAdded: Product = SUPER_IPAD;

      const result = discountCalculator.applyDiscounts([...products, productAdded], productAdded, pricingRules);

      expect(result).toEqual([
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
        SUPER_IPAD,
      ]);
    });

    it('should not apply any discounts if the added product does not match any discount', () => {
      const products: Product[] = [
        APPLE_TV,
        SUPER_IPAD,
      ];
      const productAdded: Product = MACBOOK_PRO;

      const result = discountCalculator.applyDiscounts([...products, productAdded], productAdded, pricingRules);

      expect(result).toEqual([
        APPLE_TV,
        SUPER_IPAD,
        MACBOOK_PRO,
        DISCOUNTED_VGA_ADAPTER
      ]);
    });
  });
});