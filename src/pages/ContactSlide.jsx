import { useState } from 'react';
import NavBtns from '../components/NavBtns';

// Last step (2026-11-10). The only typing in the form: name and email (required), phone
// and notes optional. Phone optional is the 456 / Sublime call and Brian can reverse it
// by setting PHONE_REQUIRED to true.
const PHONE_REQUIRED = false;

const ContactSlide = ({ logo, image, onBack, onSubmit, isSubmitting, sendError, initial = {} }) => {
    const [name, setName] = useState(initial.name || '');
    const [email, setEmail] = useState(initial.email || '');
    const [phone, setPhone] = useState(initial.phone || '');
    const [notes, setNotes] = useState(initial.notes || '');
    const [error, setError] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s().-]{7,}$/;

    const clear = () => { if (error) setError(''); };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (isSubmitting) return;
        const n = name.trim(), em = email.trim(), ph = phone.trim();
        if (!n) { setError('What name should we put on the quote?'); return; }
        if (!em) { setError('We need an email to send your quote to.'); return; }
        if (!emailRegex.test(em)) { setError('That email doesn\'t look right. Double check it?'); return; }
        if (PHONE_REQUIRED && !ph) { setError('Add a phone number so we can reach you.'); return; }
        if (ph && !phoneRegex.test(ph)) { setError('That phone number doesn\'t look right.'); return; }
        setError('');
        onSubmit({ name: n, email: em, phone: ph, notes: notes.trim() });
    };

    return (
        <div className='flex flex-col md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
            <div className='flex flex-col justify-start px-6 sm:px-12 pt-6 pb-8 md:pt-24 relative' data-fit>
                <div className='mb-8 fixed top-10 left-10 hidden md:block'>
                    <img src={logo} alt='Local Threads' className='ltLogo object-contain' />
                </div>

                <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    Where Do We Send Your <span className='accentText'>Quote?</span>
                </h1>
                <p className='text-lg mb-6 bodyColor'>We'll have pricing back to you within one business day.</p>

                <form onSubmit={handleSubmit} className='w-full max-w-md space-y-4' noValidate>
                    <input type='text' autoComplete='name' placeholder='Your Name' value={name}
                        onChange={(e) => { setName(e.target.value); clear(); }} className='inputStyle w-full' />
                    <input type='email' autoComplete='email' inputMode='email' placeholder='Email Address' value={email}
                        onChange={(e) => { setEmail(e.target.value); clear(); }} className='inputStyle w-full' />
                    <input type='tel' autoComplete='tel' inputMode='tel' placeholder={PHONE_REQUIRED ? 'Phone Number' : 'Phone Number (optional)'} value={phone}
                        onChange={(e) => { setPhone(e.target.value); clear(); }} className='inputStyle w-full' />
                    <textarea rows={2} placeholder='Anything else? Deadline, colors, sizes (optional)' value={notes}
                        onChange={(e) => { setNotes(e.target.value); clear(); }} className='textareaStyle w-full' />

                    {error && <p className='text-sm' style={{ color: '#fca5a5' }}>{error}</p>}
                    {sendError && (
                        <p className='text-sm' role='alert' style={{ color: '#fca5a5' }}>
                            {sendError} Your answers are still here, so try again, or call us at{' '}
                            <a href='tel:6147259005' style={{ color: 'var(--lt-cream)', textDecoration: 'underline' }}>614-725-9005</a>.
                        </p>
                    )}

                    <div className='flex items-center gap-5'>
                        <button type='submit' disabled={isSubmitting} className='btnColor py-3 px-8 shadow-md disabled:opacity-50'>
                            {isSubmitting ? 'Sending...' : 'Send It Over'}
                        </button>
                        <button type='button' onClick={onBack} className='md:hidden text-sm bodyColor underline' style={{ minHeight: 44 }}>Back</button>
                    </div>
                </form>

                <p className='hidden md:block mt-6 text-sm bodyColor'>No commitment. We'll get back to you within one business day.</p>
            </div>
            <div className='hidden md:block h-auto imageOverlay'>
                <img src={image} alt='Local Threads embroidery' className='w-full h-full object-cover' />
                <NavBtns onBack={onBack} onNext={() => handleSubmit()} currentStep={3} totalSteps={4} />
            </div>
        </div>
    );
};

export default ContactSlide;
