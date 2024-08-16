import { getCatalog } from "../data/catalog"
import { BundleDiscount, Discount, DiscountOverQuantityDiscount, DiscountType, XforYDiscount } from "../types/Discount"
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

    return this.handleDiscount(cart, discountForAddedProduct)
  }

  /**
   * Applies the given discount to the provided cart of products.
   * 
   * @param cart - The array of products in the cart.
   * @param discount - The discount to be applied.
   * @returns The updated cart of products after applying the discount.
   */
  protected handleDiscount = (cart: Product[], discount: Discount): Product[] => {
    let result = [...cart]

    if (discount.discountType === DiscountType.XforY) {
      result = this.applyXforYDiscount(result, discount as XforYDiscount)
    } else if (discount.discountType === DiscountType.DiscountOverQuantity) {
      result = this.applyDiscountOverQuantity(result, discount as DiscountOverQuantityDiscount)
    } else if (discount.discountType === DiscountType.Bundle) {
      result = this.applyBundleDiscount(result, discount as BundleDiscount)
    }

    return result
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

  /**
  * Applies the X-for-Y discount to the given array of cart.
  * 
  * @param cart - The array of cart to apply the discount to.
  * @param discount - The X-for-Y discount to apply.
  * @returns The updated array of cart with the discount applied.
  */
  private applyXforYDiscount = (cart: Product[], discount: XforYDiscount): Product[] => {
    let count = 0
    return cart.map((product) => {
      if (product.SKU === discount.product.SKU) {
        count++
        if (count % discount.quantityToTriggerDiscount === 0) {
          count = 0
          return {
            ...product,
            price: 0
          }
        }
      }
      return product
    })
  }

  /**
   * Applies a discount over quantity to an array of cart.
   * 
   * @param cart - The array of cart to apply the discount to.
   * @param discount - The discount to be applied.
   * @returns The updated array of cart with the discount applied.
   */
  private applyDiscountOverQuantity = (cart: Product[], discount: DiscountOverQuantityDiscount): Product[] => {
    let count = 0
    cart.map((product) => {
      if (product.SKU === discount.product.SKU) {
        count++
      }
    })

    if (count >= discount.minimumQuantity) {
      return cart.map((product) => {
        if (product.SKU === discount.product.SKU) {
          return {
            ...product,
            price: discount.discountedPrice
          }
        }
        return product
      })
    }

    return cart
  }

  private applyBundleDiscount = (cart: Product[], discount: BundleDiscount): Product[] => {
    let { macbookProCount, pricedVgaCount, freeVgaCount } = this.countMacsAndVGAs(cart, discount)

    const totalVGAsInCart = pricedVgaCount + freeVgaCount

    if (macbookProCount >= totalVGAsInCart) {
      return cart.map((product: Product) => this.handleAdditionalProduct(product, discount))
    }

    return cart.map((product) => {
      const isAdditionalProduct = product.SKU === discount.additionalProduct.SKU
      const isNotFree = product.price > 0
      const numberOfMacsAndFreeVGAsMatch = macbookProCount === freeVgaCount
      if (isAdditionalProduct && isNotFree && !numberOfMacsAndFreeVGAsMatch) {

        freeVgaCount++
        return {
          ...product,
          price: 0
        }
      }
      return product
    })
  }

  /**
   * Handles the additional product for the discount calculation.
   * 
   * @param product - The product to handle.
   * @param discount - The bundle discount to apply.
   * @returns The updated product with the discount applied.
   */
  protected handleAdditionalProduct = (product: Product, discount: BundleDiscount): Product => {
    if (product.SKU === discount.additionalProduct.SKU) {
      return {
        ...product,
        price: 0
      }
    }
    return product
  }


  /**
   * Counts the number of MacBook Pros and priced/free VGAs in the given cart, based on the provided discount.
   * 
   * @param cart - The array of products in the cart.
   * @param discount - The bundle discount to be applied.
   * @returns An object containing the counts of MacBook Pros, priced VGAs, and free VGAs.
   */
  protected countMacsAndVGAs = (cart: Product[], discount: BundleDiscount): { macbookProCount: number, pricedVgaCount: number, freeVgaCount: number } => {
    let macbookProCount = 0
    let pricedVgaCount = 0
    let freeVgaCount = 0

    cart.map((product) => {
      const isDiscountedProduct = product.SKU === discount.product.SKU
      const isAdditionalProduct = product.SKU === discount.additionalProduct.SKU

      if (isDiscountedProduct) {
        macbookProCount++
      } else if (isAdditionalProduct && product.price > 0) {
        pricedVgaCount++
      } else if (isAdditionalProduct && product.price === 0) {
        freeVgaCount++
      }
    })

    return { macbookProCount, pricedVgaCount, freeVgaCount }
  }

  /**
   * Retrieves the bundle product based on the provided discount.
   * 
   * @param discount - The bundle discount object.
   * @returns The bundle product with a price of 0.
   * @throws Error if the bundle product is not found in the catalog.
   */
  protected getBundleProduct = (discount: BundleDiscount): Product => {
    const catalog = getCatalog()
    const bundleProduct = catalog.find((product) => product.SKU === discount.additionalProduct.SKU)

    if (!bundleProduct) {
      throw new Error('Could not find the bundle product in the catalog')
    }

    return {
      ...bundleProduct,
      price: 0
    }
  }
}

export default DiscountCalculator;

// Vga must be scanned to be discounted
// When a laptop is scanned, see if there is a priced vga in the cart, if so discount it, if not add a free vga to the cart
// When a VGA is scanned. check if there is the same number of laptops and VGAs in the cart. If so, add a free VGA to the cart, if not add a priced VGA to the cart


