import { applyMiddleware, legacy_createStore, combineReducers } from 'redux'
import { thunk } from 'redux-thunk'
import authReducer from './states/Auth/Reducer'
import cartReducer from './states/Cart/Reducer'
import productReducer from './states/Products/Reducer'
import orderReducer from './states/Order/Reducer'
import wishlistReducer from './states/Wishlist/Reducer'
import reviewReducer from './states/Review/Reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  order: orderReducer,
  wishlist: wishlistReducer,
  reviews: reviewReducer,
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))