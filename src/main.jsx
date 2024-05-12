import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App.jsx';
import { store } from './redux/store';
import GlobalStyles from './components/GlobalStyles';
import { persistor } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>
                <GlobalStyles>
                    <App />
                </GlobalStyles>
            </Provider>
        </PersistGate>
    </React.StrictMode>,
);
