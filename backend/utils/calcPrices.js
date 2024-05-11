function addDecimals(num) {
  return Math.round(num * 100) / 100; // Returns a number rounded to two decimal places
}

export function calcPrices(orderItems) {
  // Calculate the items price
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // Calculate the shipping price
  const shippingPrice = itemsPrice > 300 ? 0 : 50;
  // Calculate the tax price
  const taxPrice = addDecimals(0.17 * itemsPrice);
  // Calculate the total price
  const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}
