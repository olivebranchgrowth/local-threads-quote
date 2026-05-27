import { useState } from 'react';
import NavBtns from '../components/NavBtns';

const ServiceSlide = ({ logo, image, onBack, onSubmit }) => {
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');

  const services = [
    { value: 'Screen Printing', label: 'Screen Printing', sub: 'Shirts, hoodies, pants, multi-color' },
    { value: 'Embroidery', label: 'Embroidery', sub: 'Hats, jackets, patches, leather goods' },
    { value: 'Promotional Products', label: 'Promo Products', sub: 'Stickers, bottles, flasks, merch' },
    { value: 'Not Sure Yet', label: 'Not Sure Yet', sub: 'We\'ll help you figure it out' },
  ];

  const handleSubmit = () => {
    if (!selected) {
      setError('Pick one and we\'ll go from there.');
      return;
    }
    setError('');
    onSubmit(selected);
  };

  return (
    <div className='flex flex-col-reverse md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
      <div className='flex flex-col justify-center px-6 sm:px-12 py-6 relative'>
        <div className='mb-8 fixed top-10 left-10 hidden md:block'>
          <img src={logo} alt='Local Threads' className='h-16 w-auto object-contain' />
        </div>

        <span className='eyebrow mb-6'>Service Type</span>

        <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          What Are We <em className='accentText'>Working On?</em>
        </h1>
        <p className='text-lg mb-8 bodyColor'>Pick the service that fits your project.</p>

        <div className='flex flex-col gap-3 max-w-md mb-6'>
          {services.map((svc) => (
            <button
              key={svc.value}
              onClick={() => {
                setSelected(svc.value);
                if (error) setError('');
              }}
              className={`serviceOption ${selected === svc.value ? 'selected' : ''}`}
            >
              {svc.label}
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 400, color: 'rgba(245,240,232,0.72)', fontFamily: "'Barlow', sans-serif", marginTop: '2px' }}>
                {svc.sub}
              </span>
            </button>
          ))}
        </div>

        {error && <p className='text-sm mb-4' style={{ color: '#ef4444' }}>{error}</p>}

        <button onClick={handleSubmit} className='btnColor py-3 px-8 shadow-md w-fit'>
          Continue
        </button>
      </div>
      <div className='h-auto imageOverlay'>
        <img src={image} alt='Local Threads work' className='w-full h-full object-cover' />
        <NavBtns onBack={onBack} onNext={handleSubmit} currentStep={1} />
      </div>
    </div>
  );
};

export default ServiceSlide;
