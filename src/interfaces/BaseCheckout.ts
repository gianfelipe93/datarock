import Product from "../types/Product";

/**
 * Represents the interface for a checkout process.
 * @interface
 */
interface CheckoutBase {
  scan: (product: Product) => void,
  total: () => number
}

export default CheckoutBase;