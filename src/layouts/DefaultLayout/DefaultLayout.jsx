import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <Sidebar />
            {children}
            <Footer />
        </div>
    );
}

export default DefaultLayout;
