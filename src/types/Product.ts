/**
 * Represents a product.
 *
 * @typedef {Object} Product
 * @property {string} SKU - The SKU of the product.
 * @property {string} name - The name of the product.
 * @property {number} price - The price of the product.
 */
type Product = {
  SKU: string;
  name: string;
  price: number;
}

export default Product;