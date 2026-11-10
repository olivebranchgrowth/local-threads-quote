import { useRef, useState } from 'react';
import NavBtns from '../components/NavBtns';
import { ITEM_OPTIONS } from '../utils/leadShape';

// Step 2 (2026-11-10). Tap everything that applies, in plain words. The customer no
// longer has to know screen printing from embroidery; the shop email carries a
// SUGGESTED method (utils/leadShape.js). A quick second tap on a choice moves on.
const WhatSlide = ({ logo, image, value = [], onBack, onDone }) => {
  const [sel, setSel] = useState(value);
  const [error, setError] = useState('');
  const last = useRef({ opt: null, at: 0 });

  const go = (list) => {
    if (!list.length) { setError('Tap at least one and we\'ll go from there.'); return; }
    onDone(list);
  };
  const tap = (opt, now) => {
    if (error) setError('');
    const quickRepeat = last.current.opt === opt && now - last.current.at < 400;
    last.current = { opt, at: now };
    if (quickRepeat) {
      const list = sel.includes(opt) ? sel : [...sel, opt];
      setSel(list);
      go(list);
      return;
    }
    setSel((s) => (s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt]));
  };

  const label = sel.length === 0 ? 'Continue' : sel.length === 1 ? `Continue With ${sel[0]}` : `Continue With ${sel.length} Items`;

  return (
    <div className='flex flex-col md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
      <div className='flex flex-col justify-start px-6 sm:px-12 pt-6 pb-8 md:pt-24 relative' data-fit>
        <div className='mb-8 fixed top-10 left-10 hidden md:block'>
          <img src={logo} alt='Local Threads' className='ltLogo object-contain' />
        </div>

        <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          What Are We <span className='accentText'>Making?</span>
        </h1>
        <p className='text-lg mb-6 bodyColor'>Tap all that apply. We'll pick the right way to print or stitch it.</p>

        <div className='qtyGrid max-w-md mb-6' role='group' aria-label='What are we making'>
          {ITEM_OPTIONS.map((opt) => (
            <button
              key={opt}
              type='button'
              aria-pressed={sel.includes(opt)}
              onClick={(e) => tap(opt, e.timeStamp)}
              className={`serviceOption qtyOption ${sel.includes(opt) ? 'selected' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>

        {error && <p className='text-sm mb-4' style={{ color: '#fca5a5' }}>{error}</p>}

        <button type='button' onClick={() => go(sel)} className='btnColor py-3 px-8 shadow-md w-fit'>
          {label}
        </button>
        <button type='button' onClick={onBack} className='md:hidden mt-4 text-sm bodyColor underline w-fit' style={{ minHeight: 44 }}>Back</button>
      </div>

      <div className='hidden md:block h-auto imageOverlay'>
        <img src={image} alt='Local Threads work' className='w-full h-full object-cover' />
        <NavBtns onBack={onBack} onNext={() => go(sel)} currentStep={1} totalSteps={4} />
      </div>
    </div>
  );
};

export default WhatSlide;
