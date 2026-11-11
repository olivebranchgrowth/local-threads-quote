import { useState } from 'react';
import FormInput from '../components/FormInput';
import NavBtns from '../components/NavBtns';

const QuantitySlide = ({ logo, image, onBack, onSubmit }) => {
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const trimmed = quantity.trim();

        if (!trimmed) {
            setError('Please enter a quantity.');
            return;
        }

        const parsed = parseInt(trimmed, 10);

        if (isNaN(parsed) || parsed <= 0) {
            setError('Please enter a valid number.');
            return;
        }

        setError('');
        onSubmit(parsed);
    };

    return (
        <div className='flex flex-col-reverse md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
            <div className='flex flex-col justify-center px-6 sm:px-12 py-6 md:pt-28 relative'>
                <div className='mb-8 fixed top-10 left-10 hidden md:block'>
                    <img src={logo} alt='Local Threads' className='ltLogo object-contain' />
                </div>

                <span className='eyebrow mb-6'>Quantity</span>

                <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    How Many <span className='accentText'>Pieces?</span>
                </h1>
                <p className='text-lg mb-8 bodyColor'>Give us a ballpark. We'll work with you on the final count.</p>

                <FormInput
                    value={quantity}
                    onChange={(val) => {
                        if (/^\d*$/.test(val)) {
                            setQuantity(val);
                            if (error) setError('');
                        }
                    }}
                    onSubmit={handleSubmit}
                    buttonLabel='Continue'
                />

                {error && <p className='text-sm mt-2' style={{ color: '#ef4444' }}>{error}</p>}
            </div>
            <div className='h-auto imageOverlay'>
                <img
                    src={image}
                    alt='Local Threads press'
                    className='w-full h-full object-cover'
                />
                <NavBtns onBack={onBack} onNext={handleSubmit} currentStep={3} />
            </div>
        </div>
    );
};

export default QuantitySlide;
