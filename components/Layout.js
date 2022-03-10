import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <div className="content">
            <div className="container">
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default Layout;