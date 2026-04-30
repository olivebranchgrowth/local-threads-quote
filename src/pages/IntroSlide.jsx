import { useState } from 'react';
import FormInput from '../components/FormInput';
import NavBtns from '../components/NavBtns';

const IntroSlide = ({ logo, image, onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    onSubmit(name.trim());
  };

  return (
    <div className='flex flex-col-reverse md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
      <div className='flex flex-col justify-center px-6 sm:px-12 py-6 relative'>
        <div className='mb-8 fixed top-10 left-10 hidden md:block'>
          <img src={logo} alt='Local Threads' className='h-16 w-auto object-contain' />
        </div>

        <span className='eyebrow mb-6'>Free Quote</span>

        <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          See What Your Project <em className='accentText'>Would Cost.</em>
        </h1>

        <p className='text-lg mb-2 bodyColor'>A few quick questions. Real pricing back within a day.</p>
        <p className='text-lg mb-8 headingColor' style={{ fontFamily: "'Barlow', sans-serif" }}>What's your name?</p>

        <FormInput
          value={name}
          onChange={(val) => {
            setName(val);
            if (error) setError('');
          }}
          onSubmit={handleSubmit}
        />

        {error && <p className='text-sm mt-2' style={{ color: '#ef4444' }}>{error}</p>}

        <p className='mt-6 text-sm bodyColor'>No sales calls. Just your quote.</p>
      </div>

      <div className='h-auto max-h-screen imageOverlay'>
        <img
          src={image}
          alt='Local Threads screen printing'
          className='w-full h-full object-cover'
        />
        <NavBtns
          onNext={handleSubmit}
          showBack={false}
          currentStep={0}
        />
      </div>
    </div>
  );
};

export default IntroSlide;
