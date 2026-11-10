import { useState } from 'react';
import NavBtns from '../components/NavBtns';
import { QTY_OPTIONS } from '../utils/leadShape';

// Step 1 (2026-11-10). One tap on a range and the form moves on. No typing on the
// first screen: the old opener asked for a name first and 63% of paid visitors who
// saw the form never started it.
const QtySlide = ({ logo, image, value = '', onPick }) => {
  const [picked, setPicked] = useState(value);
  const pick = (opt) => {
    setPicked(opt);
    setTimeout(() => onPick(opt), 170);
  };

  return (
    <div className='flex flex-col md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
      <div className='flex flex-col justify-start px-6 sm:px-12 pt-6 pb-8 md:pt-24 relative' data-fit>
        <div className='mb-8 fixed top-10 left-10 hidden md:block'>
          <img src={logo} alt='Local Threads' className='ltLogo object-contain' />
        </div>

        <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          How Many <span className='accentText'>Pieces?</span>
        </h1>
        <p className='text-lg mb-6 bodyColor'>Your best guess is fine. Real pricing back within one business day.</p>

        <div className='qtyGrid max-w-md' role='radiogroup' aria-label='How many pieces'>
          {QTY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type='button'
              role='radio'
              aria-checked={picked === opt}
              onClick={() => pick(opt)}
              className={`serviceOption qtyOption ${picked === opt ? 'selected' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>

        <p className='mt-6 text-sm bodyColor'>No payment up front. No sales calls. Just your quote.</p>
      </div>

      <div className='hidden md:block h-auto max-h-screen imageOverlay'>
        <img src={image} alt='Local Threads screen printing' className='w-full h-full object-cover' />
        <NavBtns onNext={() => picked && onPick(picked)} showBack={false} currentStep={0} totalSteps={4} />
      </div>
    </div>
  );
};

export default QtySlide;
