import BundleDiscount from "../classes/BundleDiscount"
import DiscountOverQuantity from "../classes/DiscountOverQuantity"
import XforYDiscount from "../classes/XforYDiscount"
import { Discount } from "../interfaces/BaseDiscount"
import { APPLE_TV, MACBOOK_PRO, SUPER_IPAD, VGA_ADAPTER } from "./catalog"

/**
 * Retrieves the pricing rules for discounts.
 *
 * @returns An array of Discount objects representing the pricing rules.
 */
const getPricingRules = (): Discount[] => {
  const discount_A = new XforYDiscount(APPLE_TV, 3)
  const discount_B = new DiscountOverQuantity(SUPER_IPAD, 5, 499.99)
  const discount_C = new BundleDiscount(MACBOOK_PRO, VGA_ADAPTER)

  return [discount_A, discount_B, discount_C];
}

export default getPricingRules