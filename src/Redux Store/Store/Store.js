import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../User/UserSlice';
import ThemeReducer from '../Theme/ThemeSlice';
import AdminSlice from '../AdminInfo/AdminSlice';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
  
  const rootReducer = combineReducers({user: userReducer, theme: ThemeReducer, data: AdminSlice});

  const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});


const persistor = persistStore(store); 

export {store, persistor};