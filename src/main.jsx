import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

import App from './App.jsx';
import { store } from './redux/store';
import GlobalStyles from './components/GlobalStyles';
import { persistor } from './redux/store';

// const stripePromise = loadStripe(
//     'pk_test_51PPfD42MhIwF8Od7jV9OxLwlIA2OvvWuXSgVIxdVDjiYUJCYrOECXcHHwMRGVg1yc4HeVlEM7vQXGA5MXvK6VtFu00seFkgGaJ',
// );

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <PersistGate loading={null} persistor={persistor}>
            {/* <Elements stripe={stripePromise}> */}
            <Provider store={store}>
                <GlobalStyles>
                    <App />
                </GlobalStyles>
            </Provider>
            {/* </Elements> */}
        </PersistGate>
    </React.StrictMode>,
);
