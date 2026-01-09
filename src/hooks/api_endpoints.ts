const api_endpoints = {
  // Cart endpoints
  FETCH_CART_ITEMS: "/cart",
  ADD_TO_CART_ITEMS: "/cart/add",
  UPDATE_CART_ITEMS: "/cart/update",
  DELETE_CART_ITEMS: "/cart",
  CLEAR_CART_ITEMS: "/cart/clear",
  
  // Checkout endpoints
  CHECKOUT: "/buyer-orders/checkout",
  UPLOAD_PAYMENT_PROOF: "/buyer-orders/upload-proof",
};

export default api_endpoints;
