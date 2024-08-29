import { BaseXforYDiscount, DiscountType } from "../interfaces/BaseDiscount";
import Product from "../types/Product";

class XforYDiscount implements BaseXforYDiscount {
  discountType: DiscountType.XforY;
  product: Product;
  quantityToTriggerDiscount: number;

  constructor(product: Product, quantityToTriggerDiscount: number) {
    this.discountType = DiscountType.XforY;
    this.product = product;
    this.quantityToTriggerDiscount = quantityToTriggerDiscount;
  }

  applyDiscount(cart: Product[]): Product[] {
    let count = 0
    return cart.map((product) => {
      if (product.SKU === this.product.SKU) {
        count++
        if (count % this.quantityToTriggerDiscount === 0) {
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
}

export default XforYDiscount;