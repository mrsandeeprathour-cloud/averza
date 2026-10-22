import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />

      <div className="main-content">
        {children}
      </div>

      <Footer />
    </>
  );
}

export default MainLayout;