import { Discount, DiscountType } from "../types/Discount"
import { APPLE_TV, MACBOOK_PRO, SUPER_IPAD, VGA_ADAPTER } from "./catalog"

/**
 * Retrieves the pricing rules for discounts.
 *
 * @returns An array of Discount objects representing the pricing rules.
 */
const getPricingRules = (): Discount[] => {
  const discount_A: Discount = {
    discountType: DiscountType.XforY,
    product: APPLE_TV,
    quantityToTriggerDiscount: 3
  }

  const discount_B: Discount = {
    discountType: DiscountType.DiscountOverQuantity,
    product: SUPER_IPAD,
    minimumQuantity: 5,
    discountedPrice: 499.99
  }

  const discount_C: Discount = {
    discountType: DiscountType.Bundle,
    product: MACBOOK_PRO,
    additionalProduct: VGA_ADAPTER
  }

  return [discount_A, discount_B, discount_C];
}

export default getPricingRules