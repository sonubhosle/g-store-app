import {
  CART_FIND_USER_REQUEST,
  CART_FIND_USER_SUCCESS,
  CART_FIND_USER_FAILURE,
  CART_ADD_ITEM_REQUEST,
  CART_ADD_ITEM_SUCCESS,
  CART_ADD_ITEM_FAILURE,
  CART_UPDATE_ITEM_REQUEST,
  CART_UPDATE_ITEM_SUCCESS,
  CART_UPDATE_ITEM_FAILURE,
  CART_REMOVE_ITEM_REQUEST,
  CART_REMOVE_ITEM_SUCCESS,
  CART_REMOVE_ITEM_FAILURE,
  CART_CLEAR,
} from "./Types";

const initialState = {
  cart: null,
  items: [],
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {

    // ── Loading ───────────────────────────────────────────────────────────────
    case CART_FIND_USER_REQUEST:
    case CART_ADD_ITEM_REQUEST:
    case CART_UPDATE_ITEM_REQUEST:
    case CART_REMOVE_ITEM_REQUEST:
      return { ...state, loading: true, error: null };

    // ── Find cart / Add item ──────────────────────────────────────────────────
    case CART_FIND_USER_SUCCESS:
    case CART_ADD_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload.cart,
        items: action.payload.items,
      };

    // ── Update item quantity ──────────────────────────────────────────────────
    case CART_UPDATE_ITEM_SUCCESS: {
      const updatedItem = action.payload;
      const updatedItems = state.items.map((item) =>
        item._id === updatedItem._id
          ? { ...item, ...updatedItem, product: item.product } // preserve populated product
          : item
      );

      const updatedCart = updatedItems.reduce(
        (acc, item) => ({
          totalPrice: acc.totalPrice + item.price,
          totalPayable: acc.totalPayable + item.discountedPrice,
          totalItem: acc.totalItem + item.quantity,
          discount: acc.discount + item.discount,
        }),
        { totalPrice: 0, totalPayable: 0, totalItem: 0, discount: 0 }
      );

      return {
        ...state,
        loading: false,
        items: updatedItems,
        cart: { ...state.cart, ...updatedCart },
      };
    }

    // ── Remove item ───────────────────────────────────────────────────────────
    case CART_REMOVE_ITEM_SUCCESS: {
      const { cartItemId } = action.payload;
      const updatedItems = state.items.filter((item) => item._id !== cartItemId);

      const updatedCart = updatedItems.reduce(
        (acc, item) => ({
          totalPrice: acc.totalPrice + item.price,
          totalPayable: acc.totalPayable + item.discountedPrice,
          totalItem: acc.totalItem + item.quantity,
          discount: acc.discount + item.discount,
        }),
        { totalPrice: 0, totalPayable: 0, totalItem: 0, discount: 0 }
      );

      return {
        ...state,
        loading: false,
        items: updatedItems,
        cart: state.cart ? { ...state.cart, ...updatedCart } : null,
      };
    }

    // ── Errors ────────────────────────────────────────────────────────────────
    case CART_FIND_USER_FAILURE:
    case CART_ADD_ITEM_FAILURE:
    case CART_UPDATE_ITEM_FAILURE:
    case CART_REMOVE_ITEM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ── Clear ─────────────────────────────────────────────────────────────────
    case CART_CLEAR:
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;