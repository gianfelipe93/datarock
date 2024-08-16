Hi there, hope you are having a good day.
# Datarock Shopping Cart challenge

In this README, I'm going to talk a bit about the code structure, what I have built, some decisions I made, etc. Stay tuned!

## Project Structure Overview

```
src
├── classes
│   ├── __test__ - This folder contains files for classes tests.
│   │   ├── Checkout.test.ts - This file includes tests for the Checkout class
│   │   └── DiscountCalculator.test.ts - This file includes tests for the DiscountCalculator class
│   ├── Checkout.ts - This is the Checkout class. This class requires the pricing rules so it can send the current cart and pricing rules to the DiscountCalculator class. This class also includes a scan(product: Product) and total() functions. The first one, when called, checks if the items added is part of any special and handle it if so, if not, then the items simply gets added to the cart. The second function sums the price of all items in the cart.
│   └── DiscountCalculator.ts - This is the DiscountCalculator class. This the most complex class in the code, it's got public, private and protected functions to expose only the functionalities necessary. The main function is "applyDiscounts(cart: Product[], productAdded: Product, pricingRules: Discount[]): Product[]".
├── data - This folder contains the catalog of products as well as the pricing rules.
│   ├── catalog.ts - This file contains all products and exports the whole catalog
│   └── getPricingRules.ts - I am not too happy with this file name because it makes the `data` folder have no pattern for the file names in it. But this file exports a function that returns the pricing rules.
├── interface - This folder contains the only interface in the code
│   └── CheckoutBase.ts - I created this interface because every checkout should have a function to scan and a function to get the total cost of the cart.
└── types - This folder contains all types used in the code
    ├── Discount.ts - This folder contains a base Discount type with fields that should be used no matter the type of discount. It also includes XforYDiscount type (like the Apple TV, 3 for the cost of 4), DiscountOverQuantityDiscount type (like the super ipad, if 5 or more then each will cost 499.99), and BundleDiscount type (like the Mac and VGA, one macOS makes one VGA free of charge).
    └── Product.ts - Product type description

index.ts - My understanding is that I don't need to write any code for it because you guys are not going to run it. I hope I am right!!!

eslint.config.mjs - I used eslint to enforce code standards, it makes the code cleaner and more readable.

## Tests

I used jest to write tests, mostly for two functions: `checkout.total()` and `discountCalculator.applyDiscounts()`.

The reason is that `discountCalculator.applyDiscounts()` is the only public function in the class, so I can't create unit tests for private and protected functions. Also, `checkout.scan()` simply calls `discountCalculator.applyDiscounts()`, so there's no point in testing it for now. Finally, `checkout.total()` returns the sum of the cart price, so testing it also confirms all discounts have been applied correctly.

## Instructions to Run the Tests

1. Run: `npm install`
2. Then run: `npm test`

Thank you for your time, guys! I hope I did a good job!
