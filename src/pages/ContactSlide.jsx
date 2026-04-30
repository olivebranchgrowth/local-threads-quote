import { useState } from 'react';
import FormInput from '../components/FormInput';
import NavBtns from '../components/NavBtns';

const ContactSlide = ({ logo, image, onBack, onSubmit, isSubmitting }) => {
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s()-]{7,}$/;

    const handleSubmit = () => {
        const trimmedPhone = phone.trim();
        const trimmedEmail = email.trim();

        if (!trimmedPhone || !trimmedEmail) {
            setError('We need both to get your quote back to you.');
            return;
        }

        if (!emailRegex.test(trimmedEmail)) {
            setError('That email doesn\'t look right. Double check it?');
            return;
        }

        if (!phoneRegex.test(trimmedPhone)) {
            setError('That phone number doesn\'t look right.');
            return;
        }

        setError('');
        onSubmit({ phone: trimmedPhone, email: trimmedEmail });
    };

    return (
        <div className='flex flex-col-reverse md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
            <div className='flex flex-col justify-center px-6 sm:px-12 py-6 relative'>
                <div className='mb-8 fixed top-10 left-10 hidden md:block'>
                    <img src={logo} alt='Local Threads' className='h-16 w-auto object-contain' />
                </div>

                <span className='eyebrow mb-6'>Almost Done</span>

                <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    Where Do We Send Your <em className='accentText'>Quote?</em>
                </h1>
                <p className='text-lg mb-8 bodyColor'>We'll have pricing back to you within one business day.</p>

                <div className='space-y-6'>
                    <FormInput
                        value={phone}
                        onChange={(val) => {
                            setPhone(val);
                            if (error) setError('');
                        }}
                        onSubmit={handleSubmit}
                        placeholder='Phone Number'
                        showButton={false}
                    />
                    <FormInput
                        value={email}
                        onChange={(val) => {
                            setEmail(val);
                            if (error) setError('');
                        }}
                        onSubmit={handleSubmit}
                        placeholder='Email Address'
                        buttonLabel={isSubmitting ? 'Sending...' : 'Send It Over'}
                        disabled={isSubmitting}
                    />
                </div>
                {error && <p className='text-sm mt-4' style={{ color: '#ef4444' }}>{error}</p>}

                <p className='mt-6 text-sm bodyColor'>No commitment. We'll get back to you within one business day.</p>
            </div>
            <div className='h-auto imageOverlay'>
                <img
                    src={image}
                    alt='Local Threads embroidery'
                    className='w-full h-full object-cover'
                />
                <NavBtns onBack={onBack} onNext={handleSubmit} currentStep={4} />
            </div>
        </div>
    );
};

export default ContactSlide;
