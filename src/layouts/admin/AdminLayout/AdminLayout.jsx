import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <Sidebar />
            {children}
        </div>
    );
}

export default DefaultLayout;
