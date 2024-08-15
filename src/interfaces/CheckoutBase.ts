/**
 * Represents the interface for a checkout process.
 * @interface
 */
interface CheckoutBase {
  scan: (product: Product) => void,
  total: () => number
}