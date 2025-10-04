"use client";

import { createContext, useContext } from "react";
import { useCartManagement } from "@/hooks/useCartManagement";

const CartItemsContext = createContext<
  ReturnType<typeof useCartManagement>["cartItems"]
>([]);
const CartTotalsContext = createContext<
  Pick<ReturnType<typeof useCartManagement>, "totalItems" | "totalPrice">
>({ totalItems: 0, totalPrice: 0 });
const CartActionsContext = createContext<Pick<
  ReturnType<typeof useCartManagement>,
  "fetchCart" | "addToCart" | "updateCartItem" | "deleteCartItem" | "clearCart"
> | null>(null);
const CartNotificationsContext = createContext<
  Pick<
    ReturnType<typeof useCartManagement>,
    "notifications" | "removeNotification"
  >
>({ notifications: [], removeNotification: () => {} });
// isLoading context
const CartLoadingContext = createContext<boolean>(false);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cart = useCartManagement();

  return (
    <CartItemsContext.Provider value={cart.cartItems}>
      <CartTotalsContext.Provider
        value={{ totalItems: cart.totalItems, totalPrice: cart.totalPrice }}
      >
        <CartActionsContext.Provider
          value={{
            fetchCart: cart.fetchCart,
            addToCart: cart.addToCart,
            updateCartItem: cart.updateCartItem,
            deleteCartItem: cart.deleteCartItem,
            clearCart: cart.clearCart,
          }}
        >
          <CartNotificationsContext.Provider
            value={{
              notifications: cart.notifications,
              removeNotification: cart.removeNotification,
            }}
          >
            <CartLoadingContext.Provider value={cart.isLoading}>
              {children}
            </CartLoadingContext.Provider>
          </CartNotificationsContext.Provider>
        </CartActionsContext.Provider>
      </CartTotalsContext.Provider>
    </CartItemsContext.Provider>
  );
};

// Hooks
export const useCartItems = () => useContext(CartItemsContext);
export const useCartTotals = () => useContext(CartTotalsContext);
export const useCartActions = () => {
  const ctx = useContext(CartActionsContext);
  if (!ctx) throw new Error("useCartActions must be used inside CartProvider");
  return ctx;
};
export const useCartNotifications = () => useContext(CartNotificationsContext);
export const useCartLoading = () => useContext(CartLoadingContext);
