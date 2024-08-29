import Product from "../types/Product";

export enum DiscountType {
  XforY = 'XforY',
  DiscountOverQuantity = 'discountOverQuantity',
  Bundle = 'bundle'
}

/**
 * Represents a base discount.
 *
 * @interface BaseDiscount
 * @property {DiscountType} discountType - The type of discount.
 * @property {Product} product - The product associated with the discount.
 * @property {(cart: Product[]) => Product[]} applyDiscount - A function that applies the discount to a cart of products.
 */
interface BaseDiscount {
  discountType: DiscountType
  product: Product
  applyDiscount: (cart: Product[]) => Product[]
}


/**
 * Represents a discount that applies when purchasing a certain quantity of items.
 * This discount type follows the "X for Y" rule, where a specific quantity triggers the discount.
 */
export interface BaseXforYDiscount extends BaseDiscount {
  discountType: DiscountType.XforY;
  quantityToTriggerDiscount: number;
}

/**
 * Represents a discount that is applied over a certain quantity of items.
 * This discount type is a subtype of BaseDiscount.
 */
export interface BaseDiscountOverQuantityDiscount extends BaseDiscount {
  discountType: DiscountType.DiscountOverQuantity;
  minimumQuantity: number;
  discountedPrice: number;
}

/**
 * Represents a bundle discount.
 *
 * @remarks
 * This interface extends the `BaseDiscount` interface and adds properties specific to bundle discounts.
 *
 * @typeparam T - The type of the additional product.
 *
 * @public
 */
export interface BaseBundleDiscount extends BaseDiscount {
  discountType: DiscountType.Bundle;
  additionalProduct: Product;
}

/**
 * Represents a discount.
 */
export type Discount = BaseXforYDiscount | BaseDiscountOverQuantityDiscount | BaseBundleDiscount;