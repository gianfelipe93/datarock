import { Discount, DiscountType, XforYDiscount } from "../types/Discount";
import DiscountCalculator from "./DiscountCalculator";

/**
 * Represents a checkout process for purchasing products.
 * @class
 * @implements {CheckoutBase}
 */
class Checkout implements CheckoutBase {
  private _products: Product[]
  private _pricingRules: Discount[];
  private _discountCalculator: DiscountCalculator;


  constructor(pricingRules: Discount[]) {
    this._pricingRules = pricingRules;
    this._products = [];
    this._discountCalculator = new DiscountCalculator();
  }

  scan(product: Product) {
    this._products = this._discountCalculator.applyDiscounts([...this._products, product], product, this._pricingRules)
  }

  total() {
    return this._products.reduce((total, product) => total + product.price, 0)
  }

  list() {
    return [...this._products]
  }
}

export default Checkout;