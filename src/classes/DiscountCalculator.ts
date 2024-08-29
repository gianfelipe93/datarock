import { Discount, DiscountType } from "../interfaces/BaseDiscount"
import Product from "../types/Product"

/**
 * DiscountCalculator class represents a calculator for applying discounts to cart.
 */
class DiscountCalculator {
  /**
   * Applies discounts to the cart based on the given product and pricing rules.
   * 
   * @param cart - The array of products in the cart.
   * @param productAdded - The product that was added to the cart.
   * @param pricingRules - The array of discount rules to be applied.
   * @returns The updated cart with discounts applied.
   */
  applyDiscounts(cart: Product[], productAdded: Product, pricingRules: Discount[]): Product[] {
    const discountForAddedProduct = this.checkDiscountForProduct(productAdded, pricingRules)

    if (!discountForAddedProduct) {
      return cart
    }

    return discountForAddedProduct.applyDiscount(cart)
  }

  /**
   * Checks if a product is eligible for a discount based on the provided pricing rules.
   * @param product - The product to check for a discount.
   * @param pricingRules - The array of discount rules to apply.
   * @returns The discount object if the product is eligible for a discount, otherwise undefined.
   */
  protected checkDiscountForProduct = (product: Product, pricingRules: Discount[]): Discount | undefined => {
    return pricingRules.find((discount) => {
      if (discount.discountType === DiscountType.Bundle) {
        return discount.product.SKU === product.SKU || discount.additionalProduct.SKU === product.SKU
      }

      return discount.product.SKU === product.SKU
    })
  }
}

export default DiscountCalculator;