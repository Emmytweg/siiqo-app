import api from "@/lib/api_client";

// Local helper to ensure auth header is present for cart calls
const authHeaders = () => {
  if (typeof window === "undefined") return {};
  const token =
    sessionStorage.getItem("RSToken") ||
    localStorage.getItem("RSToken") ||
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("RSToken"))
      ?.split("=")[1];

  return token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {};
};

export const cartService = {
  // Matches your api.ts: apiClient.post("/cart/add", data)
  addToCart: async (productId: number, quantity: number) => {
    const response = await api.post(
      "/cart/add",
      { product_id: productId, quantity },
      { headers: authHeaders() }
    );
    return response.data;
  },

  // Matches your api.ts: apiClient.get("/cart")
  fetchCartItems: async () => {
    const response = await api.get("/cart", { headers: authHeaders() });
    return response.data;
  },

  // Matches your api.ts: apiClient.patch(`/cart/update/${itemId}`, data)
  updateCartItem: async (itemId: number | string, quantity: number) => {
    const response = await api.patch(
      `/cart/update/${itemId}`,
      { quantity },
      { headers: authHeaders() }
    );
    return response.data;
  },

  // Delete cart item by ID
  deleteCartItem: async (itemId: number | string) => {
    const response = await api.delete(`/cart/delete/${itemId}`, {
      headers: authHeaders(),
    });
    return response.data;
  },

  // Matches your api.ts: apiClient.delete("/cart/clear")
  clearCart: async () => {
    const response = await api.delete("/cart/clear", {
      headers: authHeaders(),
    });
    return response.data;
  },

  // Matches your api.ts: apiClient.post("/buyer-orders/checkout", data)
  checkout: async (checkoutData: any) => {
    const response = await api.post("/buyer-orders/checkout", checkoutData, {
      headers: authHeaders(),
    });
    return response.data;
  },
};