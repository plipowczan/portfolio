import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import Modal from "../ui/Modal";
import BookingModalContent from "../booking/BookingModalContent";
import CookieBanner from "../ui/CookieBanner";
import Footer from "./Footer";
import Navigation from "./Navigation";

const Layout = ({ children }) => {
  const location = useLocation();
  const { isBookingModalOpen, closeBookingModal } = useBooking();

  useEffect(() => {
    // Przewiń do góry tylko jeśli zmienia się pathname (nie hash)
    // Hash linki są obsługiwane w Navigation.jsx i Home.jsx
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
      <CookieBanner />

      {/* Global Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        title="Rezerwacja bezpłatnej konsultacji"
      >
        <BookingModalContent />
      </Modal>
    </div>
  );
};

export default Layout;
