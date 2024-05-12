import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import appReducer from './app/appSlice';
import accountSlice from './account/accountSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['app'],
};
const rootReducer = combineReducers({
    app: appReducer,
    account: accountSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

// Redux store
// export const store = configureStore({
//     reducer: {
//         app: appReducer,
//     },
// });
