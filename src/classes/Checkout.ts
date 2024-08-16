import CheckoutBase from "../interfaces/CheckoutBase";
import { Discount } from "../types/Discount";
import Product from "../types/Product";
import DiscountCalculator from "./DiscountCalculator";

/**
 * Represents a checkout process for purchasing products.
 * @class
 * @implements {CheckoutBase}
 */
class Checkout implements CheckoutBase {
  private _cart: Product[]
  private _pricingRules: Discount[];
  private _discountCalculator: DiscountCalculator;


  /**
   * Constructs a new instance of the Checkout class.
   * @param pricingRules - The pricing rules for the checkout.
   */
  constructor(pricingRules: Discount[]) {
    this._pricingRules = pricingRules;
    this._cart = [];
    this._discountCalculator = new DiscountCalculator();
  }

  /**
   * Scans a product and applies discounts to the list of products.
   * 
   * @param {Product} product - The product to be scanned.
   * @returns {void}
   */
  scan(product: Product) {
    this._cart = this._discountCalculator.applyDiscounts([...this._cart, product], product, this._pricingRules)
  }

  /**
   * Calculates the total price of all products in the checkout.
   *
   * @returns The total price of all products.
   */
  total() {
    return this._cart.reduce((total, product) => total + product.price, 0)
  }

  /**
   * Returns the current cart, this helps with debugging.
   *
   * @returns The total price of all products.
  */
  list() {
    return this._cart
  }
}

export default Checkout;