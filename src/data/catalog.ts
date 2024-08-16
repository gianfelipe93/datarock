import Product from "../types/Product"

export const SUPER_IPAD: Product = {
  SKU: 'ipd',
  name: 'Super iPad',
  price: 549.99
}

export const MACBOOK_PRO: Product = {
  SKU: 'mbp',
  name: 'MacBook Pro',
  price: 1399.99
}

export const APPLE_TV: Product = {
  SKU: 'atv',
  name: 'Apple TV',
  price: 109.50
}

export const VGA_ADAPTER: Product = {
  SKU: 'vga',
  name: 'VGA Adapter',
  price: 30.00
}

export const getCatalog = (): Product[] => ([SUPER_IPAD, MACBOOK_PRO, APPLE_TV, VGA_ADAPTER])