import { BaseBundleDiscount, DiscountType } from "../interfaces/BaseDiscount";
import Product from "../types/Product";

/**
 * Represents a bundle discount for a product.
 * @class
 * @implements {BaseBundleDiscount}
 */
class BundleDiscount implements BaseBundleDiscount {
  discountType: DiscountType.Bundle;
  additionalProduct: Product;
  product: Product;

  constructor(product: Product, additionalProduct: Product) {
    this.discountType = DiscountType.Bundle;
    this.product = product;
    this.additionalProduct = additionalProduct;
  }

  applyDiscount(cart: Product[]): Product[] {
    let { discountProduct, pricedAdditionalProduct, freeAdditionalProduct } = this.countProductAndAdditionalProduct(cart, this)

    const totalVGAsInCart = pricedAdditionalProduct + freeAdditionalProduct

    if (discountProduct >= totalVGAsInCart) {
      return cart.map((product: Product) => this.handleAdditionalProduct(product, this))
    }

    return cart.map((product) => {
      const isAdditionalProduct = product.SKU === this.additionalProduct.SKU
      const isNotFree = product.price > 0
      const numberOfMacsAndFreeVGAsMatch = discountProduct === freeAdditionalProduct
      if (isAdditionalProduct && isNotFree && !numberOfMacsAndFreeVGAsMatch) {

        freeAdditionalProduct++
        return {
          ...product,
          price: 0
        }
      }
      return product
    })
  }

  protected countProductAndAdditionalProduct = (cart: Product[], discount: BundleDiscount): { discountProduct: number, pricedAdditionalProduct: number, freeAdditionalProduct: number } => {
    let discountProduct = 0
    let pricedAdditionalProduct = 0
    let freeAdditionalProduct = 0

    cart.map((product) => {
      const isDiscountedProduct = product.SKU === discount.product.SKU
      const isAdditionalProduct = product.SKU === discount.additionalProduct.SKU

      if (isDiscountedProduct) {
        discountProduct++
      } else if (isAdditionalProduct && product.price > 0) {
        pricedAdditionalProduct++
      } else if (isAdditionalProduct && product.price === 0) {
        freeAdditionalProduct++
      }
    })

    return { discountProduct, pricedAdditionalProduct, freeAdditionalProduct }
  }


  protected handleAdditionalProduct = (product: Product, discount: BundleDiscount): Product => {
    if (product.SKU === discount.additionalProduct.SKU) {
      return {
        ...product,
        price: 0
      }
    }
    return product
  }
}

export default BundleDiscount;