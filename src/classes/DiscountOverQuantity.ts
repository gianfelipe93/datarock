import { BaseDiscountOverQuantityDiscount, DiscountType } from "../interfaces/BaseDiscount";
import Product from "../types/Product";

class DiscountOverQuantity implements BaseDiscountOverQuantityDiscount {
  discountType: DiscountType.DiscountOverQuantity;
  minimumQuantity: number;
  discountedPrice: number;
  product: Product;

  constructor(product: Product, minimumQuantity: number, discountedPrice: number) {
    this.discountType = DiscountType.DiscountOverQuantity;
    this.product = product;
    this.minimumQuantity = minimumQuantity;
    this.discountedPrice = discountedPrice;
  }

  applyDiscount(cart: Product[]): Product[] {
    let count = 0
    cart.map((product) => {
      if (product.SKU === this.product.SKU) {
        count++
      }
    })

    if (count >= this.minimumQuantity) {
      return cart.map((product) => {
        if (product.SKU === this.product.SKU) {
          return {
            ...product,
            price: this.discountedPrice
          }
        }
        return product
      })
    }

    return cart
  }
}

export default DiscountOverQuantity;