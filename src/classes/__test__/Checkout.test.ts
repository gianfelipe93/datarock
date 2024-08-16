import { APPLE_TV, MACBOOK_PRO, SUPER_IPAD, VGA_ADAPTER } from '../../data/catalog';
import getPricingRules from '../../data/getPricingRules';
import Checkout from '../Checkout';

describe('Checkout', () => {
  let checkout: Checkout;

  beforeEach(() => {
    checkout = new Checkout(getPricingRules());
  });

  describe('instance check', () => {
    it('should create a new Checkout instance', () => {
      const checkout = new Checkout(getPricingRules());
      expect(checkout).toBeInstanceOf(Checkout);
    });
  })

  describe('total() - No Discount', () => {
    it('should return the total correctly for products with no discounts associated', () => {
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);

      const total = checkout.total();
      expect(total).toEqual(659.49);
    });
  })

  describe('total() - XforY Discount', () => {
    it('should check if product Apple TV scanned in order will get discounted if there is more than the minimum required quantity', () => {
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);

      const total = checkout.total();
      expect(total).toEqual(768.99);
    })

    it('should check if product Apple TV scanned out of order will get discounted if there is more than the minimum required quantity', () => {
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);
      checkout.scan(APPLE_TV);

      const total = checkout.total();
      expect(total).toEqual(768.99);
    })

    it('should check if product Apple TV scanned in order will get discounted multiple times if eligible', () => {
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);

      const total = checkout.total();
      expect(total).toEqual(987.99);
    })

    it('should check if product Apple TV scanned out of order will get discounted multiple times if eligible', () => {
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);

      const total = checkout.total();
      expect(total).toEqual(987.99);
    })

    it('should check if product Apple TV will get discounted if there is less than the minimum required quantity', () => {
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);

      const total = checkout.total();
      expect(total).toEqual(768.99);
    })
  })

  describe('total() - DiscountOverQuantity Discount', () => {
    it('should check if product Super IPad scanned in order will get discounted if there is more than the minimum required quantity', () => {
      const product_A = SUPER_IPAD;
      const product_A_1 = SUPER_IPAD;
      const product_A_2 = SUPER_IPAD;
      const product_A_3 = SUPER_IPAD;
      const product_A_4 = SUPER_IPAD;
      const product_B = APPLE_TV;

      checkout.scan(product_A);
      checkout.scan(product_A_1);
      checkout.scan(product_A_2);
      checkout.scan(product_A_3);
      checkout.scan(product_A_4);
      checkout.scan(product_B);

      const total = checkout.total();
      expect(total).toEqual(2609.45);
    })

    it('should check if product Super IPad scanned in out of order will get discounted if there is more than the minimum required quantity', () => {
      const product_A = SUPER_IPAD;
      const product_A_1 = SUPER_IPAD;
      const product_A_2 = SUPER_IPAD;
      const product_A_3 = SUPER_IPAD;
      const product_A_4 = SUPER_IPAD;
      const product_B = APPLE_TV;

      checkout.scan(product_A);
      checkout.scan(product_A_1);
      checkout.scan(product_B);
      checkout.scan(product_A_2);
      checkout.scan(product_A_3);
      checkout.scan(product_A_4);

      const total = checkout.total();
      expect(total).toEqual(2609.45);
    })

    it('should check if product Super IPad scanned in order will get discounted if there is less than the minimum required quantity', () => {
      const product_A = SUPER_IPAD;
      const product_A_1 = SUPER_IPAD;
      const product_A_2 = SUPER_IPAD;
      const product_A_3 = SUPER_IPAD;
      const product_B = APPLE_TV;

      checkout.scan(product_A);
      checkout.scan(product_A_1);
      checkout.scan(product_A_2);
      checkout.scan(product_A_3);
      checkout.scan(product_B);

      const total = checkout.total();
      expect(total).toEqual(2309.46);
    })

    it('should check if product Super IPad scanned out of order will get discounted if there is less than the minimum required quantity', () => {
      const product_A = SUPER_IPAD;
      const product_A_1 = SUPER_IPAD;
      const product_A_2 = SUPER_IPAD;
      const product_A_3 = SUPER_IPAD;
      const product_B = APPLE_TV;

      checkout.scan(product_A);
      checkout.scan(product_A_1);
      checkout.scan(product_B);
      checkout.scan(product_A_2);
      checkout.scan(product_A_3);

      const total = checkout.total();
      expect(total).toEqual(2309.46);
    })
  })

  describe('total() - Bundle Discount', () => {
    it('should check if VGA will not be charged when there is a macbook', () => {
      checkout.scan(MACBOOK_PRO);
      checkout.scan(APPLE_TV);

      const total = checkout.total();
      expect(total).toEqual(1509.49);
    })

    it('should check if VGA wont be charges regardless of how many Macos are added', () => {
      checkout.scan(MACBOOK_PRO);
      checkout.scan(MACBOOK_PRO);

      const total = checkout.total();
      expect(total).toEqual(2799.98);
    })

    it('should make the VGA adapter in the cart free of charge and charge the two macbooks', () => {
      checkout.scan(MACBOOK_PRO);
      checkout.scan(MACBOOK_PRO);
      checkout.scan(VGA_ADAPTER);

      const total = checkout.total();
      expect(total).toEqual(2799.98);
    })

    it('should make the VGA adapter in the cart free of charge and charge the two macbooks when VGA is scanned first', () => {
      checkout.scan(VGA_ADAPTER);
      checkout.scan(MACBOOK_PRO);
      checkout.scan(MACBOOK_PRO);

      const total = checkout.total();
      expect(total).toEqual(2799.98);
    })

    it('should make the 2 VGA adapter in the cart free of charge and charge the two macbooks', () => {
      checkout.scan(MACBOOK_PRO);
      checkout.scan(MACBOOK_PRO);
      checkout.scan(VGA_ADAPTER);
      checkout.scan(VGA_ADAPTER);

      const total = checkout.total();
      expect(total).toEqual(2799.98);
    })

    it('should make 2 VGA adapter in the cart free of charge, charge the two macbooks and a vga', () => {
      checkout.scan(MACBOOK_PRO);
      checkout.scan(MACBOOK_PRO);
      checkout.scan(VGA_ADAPTER);
      checkout.scan(VGA_ADAPTER);
      checkout.scan(VGA_ADAPTER);

      const total = checkout.total();
      expect(total).toEqual(2829.98);
    })

    it('should make 2 VGA adapter in the cart free of charge, charge the two macbooks and a vga when VGAs are scanned first', () => {
      checkout.scan(VGA_ADAPTER);
      checkout.scan(VGA_ADAPTER);
      checkout.scan(VGA_ADAPTER);
      checkout.scan(MACBOOK_PRO);
      checkout.scan(MACBOOK_PRO);

      const total = checkout.total();
      expect(total).toEqual(2829.98);
    })
  })

  describe('total() - To be deleted', () => {
    it('1 should check if product Super IPad scanned in order will get discounted if there is more than the minimum required quantity', () => {
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(VGA_ADAPTER);

      const total = checkout.total();
      expect(total).toEqual(249.00);
    })

    it('2 should check if product Super IPad scanned in order will get discounted if there is more than the minimum required quantity', () => {
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);
      checkout.scan(SUPER_IPAD);
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);
      checkout.scan(SUPER_IPAD);
      checkout.scan(SUPER_IPAD);

      const total = checkout.total();
      expect(total).toEqual(2718.95);
    })

    // it('3 should check if product Super IPad scanned in order will get discounted if there is more than the minimum required quantity', () => {
    //   checkout.scan(MACBOOK_PRO);
    //   checkout.scan(VGA_ADAPTER);
    //   checkout.scan(SUPER_IPAD);

    //   const total = checkout.total();
    //   expect(total).toEqual(1949.98);
    // })
  })

  describe('total() - Multiple Discounts', () => {
    it('should apply discount to the Apple TVs and make the VGA free of charge', () => {
      checkout.scan(MACBOOK_PRO);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(VGA_ADAPTER);
      checkout.scan(APPLE_TV);

      const total = checkout.total();
      expect(total).toEqual(1618.99);
    })

    it('should apply discount to the Apple TVs and Super Ipads', () => {
      checkout.scan(SUPER_IPAD);
      checkout.scan(APPLE_TV);
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);
      checkout.scan(SUPER_IPAD);
      checkout.scan(APPLE_TV);
      checkout.scan(SUPER_IPAD);

      const total = checkout.total();
      expect(total).toEqual(2828.45);
    })

    it('should apply discount to the Super Ipads and 2 make VGA Free of Charge but one should be charged', () => {
      checkout.scan(SUPER_IPAD);
      checkout.scan(MACBOOK_PRO);
      checkout.scan(VGA_ADAPTER);
      checkout.scan(SUPER_IPAD);
      checkout.scan(MACBOOK_PRO);
      checkout.scan(SUPER_IPAD);
      checkout.scan(SUPER_IPAD);
      checkout.scan(MACBOOK_PRO);
      checkout.scan(SUPER_IPAD);
      checkout.scan(SUPER_IPAD);
      checkout.scan(VGA_ADAPTER);

      const total = checkout.total();
      expect(Math.abs(total - 7199.91)).toBeLessThanOrEqual(0.001);
    })
  })
});