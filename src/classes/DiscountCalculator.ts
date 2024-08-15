import { Discount, DiscountOverQuantityDiscount, DiscountType, XforYDiscount } from "../types/Discount"

/**
 * DiscountCalculator class represents a calculator for applying discounts to products.
 */
class DiscountCalculator {
  applyDiscounts(products: Product[], productAdded: Product, pricingRules: Discount[]): Product[] {
    const bundleDiscount = pricingRules.find(discount => discount.discountType === DiscountType.Bundle)

    if (bundleDiscount && productAdded.SKU === bundleDiscount?.product.SKU) {
      return products.concat({ ...bundleDiscount.additionalProduct, price: 0 })
    }
    var result = [...products]

    for (const discount of pricingRules) {
      if (discount.discountType === DiscountType.XforY) {
        result = this.applyXforYDiscount(result, discount as XforYDiscount)
      }

      if (discount.discountType === DiscountType.DiscountOverQuantity) {
        result = this.applyDiscountOverQuantity(result, discount as DiscountOverQuantityDiscount)
      }
    }

    return result
  }

  protected findSKUsToDiscount = (products: Product[], productSKU: string) => {
    return products.filter(product => product.SKU === productSKU)
  }

  protected replaceDiscountedSKUs(products: Product[], productSKU: string, newProducts: Product[]) {
    return products.filter(product => product.SKU !== productSKU).concat(newProducts)
  }

  private applyXforYDiscount = (products: Product[], discount: XforYDiscount): Product[] => {
    const productsToBeDiscounted = this.findSKUsToDiscount(products, discount.product.SKU)

    if (!productsToBeDiscounted) {
      return products
    }


    const discountedProducts = productsToBeDiscounted.map((product, index) => {
      const count = index + 1
      const { quantityToTriggerDiscount } = discount

      if (count % quantityToTriggerDiscount === 0) {
        return {
          ...product,
          price: 0
        }
      }

      return product
    })

    return this.replaceDiscountedSKUs(products, discount.product.SKU, discountedProducts)
  }

  private applyDiscountOverQuantity = (products: Product[], discount: DiscountOverQuantityDiscount): Product[] => {
    const productsToBeDiscounted = this.findSKUsToDiscount(products, discount.product.SKU)

    if (!productsToBeDiscounted) {
      return products
    }

    if (productsToBeDiscounted.length >= discount.minimumQuantity) {
      const discountedProducts = productsToBeDiscounted.map(product => {
        return {
          ...product,
          price: discount.discountedPrice
        }
      })

      return this.replaceDiscountedSKUs(products, discount.product.SKU, discountedProducts)
    }

    return products
  }
}

export default DiscountCalculator;