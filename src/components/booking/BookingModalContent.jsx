import { useTranslation } from "react-i18next";
import ZencalWidget from "../widgets/ZencalWidget";

const BookingModalContent = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-center">{t("booking.modalDescription")}</p>
      {/* The embed reads its language once, at load, so a language change
          remounts it instead of leaving it in the old one. */}
      <ZencalWidget key={i18n.language} />
    </div>
  );
};

export default BookingModalContent;
