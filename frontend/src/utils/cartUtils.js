export const addDecimals = (num) => {
  // Returns a number rounded to two decimal places
  return Math.round(num * 100) / 100;
};

export const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate shipping price (If order is over 300 then free, else 50 shipping)
  state.shippingPrice = state.itemsPrice > 300 ? 0 : 50;

  // Calculate tax price (17% VAT Tax)
  state.taxPrice = addDecimals(0.17 * state.itemsPrice);

  // Calculate total price
  state.totalPrice = addDecimals(
    Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
  );

  // Format the numbers to two decimal places for display/storage
  state.itemsPrice = state.itemsPrice.toFixed(2);
  state.shippingPrice = state.shippingPrice.toFixed(2);
  state.taxPrice = state.taxPrice.toFixed(2);
  state.totalPrice = state.totalPrice.toFixed(2);

  // Store updated cart state in local storage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
