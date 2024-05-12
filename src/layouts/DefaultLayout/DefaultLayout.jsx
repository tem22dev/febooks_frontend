import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function DefaultLayout({ children }) {
    return (
        <>
            <Header />
            {/* <Sidebar /> */}
            {children}
            {/* <Footer /> */}
        </>
    );
}

export default DefaultLayout;
