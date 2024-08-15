export enum DiscountType {
  XforY = 'XforY',
  DiscountOverQuantity = 'discountOverQuantity',
  Bundle = 'bundle'
}

/**
 * Represents a base discount.
 *
 * @typedef {Object} BaseDiscount
 * @property {DiscountType} discountType - The type of discount.
 * @property {Product} product - The product associated with the discount.
 */
type BaseDiscount = {
  discountType: DiscountType
  product: Product
}

/**
 * Represents a discount of type X for Y.
 */
export type XforYDiscount = {
  discountType: DiscountType.XforY;
  quantityToTriggerDiscount: number;
} & BaseDiscount

/**
 * Represents a discount over quantity discount.
 *
 * @remarks
 * This interface extends the `BaseDiscount` interface and defines the properties specific to a discount over quantity.
 *
 * @public
 */
export type DiscountOverQuantityDiscount = {
  discountType: DiscountType.DiscountOverQuantity;
  minimumQuantity: number;
  discountedPrice: number;
} & BaseDiscount

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
export type BundleDiscount = {
  discountType: DiscountType.Bundle;
  additionalProduct: Product;
} & BaseDiscount

/**
 * Represents a discount.
 */
export type Discount = XforYDiscount | DiscountOverQuantityDiscount | BundleDiscount;