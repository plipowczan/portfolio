import ZencalWidget from '../widgets/ZencalWidget';

const BookingModalContent = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-center">
        Wybierz dogodny termin z kalendarza poniżej. Po rezerwacji otrzymasz
        link do spotkania online oraz instrukcje przygotowania.
      </p>
      <ZencalWidget />
    </div>
  );
};

export default BookingModalContent;
