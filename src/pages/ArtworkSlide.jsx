import { useState, useRef } from 'react';
import NavBtns from '../components/NavBtns';

// Keep raw files small enough that the base64 payload clears the mail service's request limit.
const MAX_BYTES = 3 * 1024 * 1024; // 3MB

const ArtworkSlide = ({ logo, image, onBack, onSubmit }) => {
    const [attachment, setAttachment] = useState(null); // { name, type, data(base64) }
    const [description, setDescription] = useState('');
    const [reading, setReading] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > MAX_BYTES) {
            setError('That file is over 3MB. Send a smaller version, or just describe it below and we will grab the full art over email.');
            setAttachment(null);
            return;
        }

        setError('');
        setReading(true);
        const reader = new FileReader();
        reader.onload = () => {
            // Strip the "data:<type>;base64," prefix; the mail service wants raw base64.
            const data = String(reader.result || '').split(',')[1] || '';
            setAttachment({ name: file.name, type: file.type || 'application/octet-stream', data });
            setReading(false);
        };
        reader.onerror = () => {
            setError('That file would not read. Try another, or describe your art below.');
            setReading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        if (reading) {
            setError('Hang tight, your file is still loading.');
            return;
        }
        setError('');
        onSubmit({ attachment, artworkDescription: description.trim() });
    };

    return (
        <div className='flex flex-col-reverse md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
            <div className='flex flex-col justify-center px-6 sm:px-12 py-6 relative'>
                <div className='mb-8 fixed top-10 left-10 hidden md:block'>
                    <img src={logo} alt='Local Threads' className='h-16 w-auto object-contain' />
                </div>

                <span className='eyebrow mb-6'>Your Artwork</span>

                <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    Got A Logo Or <em className='accentText'>Design?</em>
                </h1>
                <p className='text-lg mb-6 bodyColor'>
                    Attach it and we will work from your file. No art yet? Skip this or describe the idea, our in-house team can build it for you.
                </p>

                <div className='w-full max-w-md'>
                    <button
                        type='button'
                        onClick={() => fileRef.current?.click()}
                        className='btnColor py-3 px-8 shadow-md'
                        disabled={reading}
                    >
                        {reading ? 'Loading...' : (attachment ? 'Replace File' : 'Upload Artwork')}
                    </button>
                    <input
                        ref={fileRef}
                        type='file'
                        accept='image/*,.pdf,.ai,.eps,.svg,.psd'
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    {attachment && !error && (
                        <p className='text-sm mt-3 bodyColor'>
                            <span className='font-semibold'>Attached:</span> {attachment.name}
                        </p>
                    )}

                    <textarea
                        value={description}
                        onChange={(e) => { setDescription(e.target.value); if (error) setError(''); }}
                        placeholder='Or describe your design idea: colors, placement, text...'
                        rows={3}
                        className='textareaStyle w-full mt-4 mb-2'
                    />
                    {error && (
                        <p className='text-sm mb-2' style={{ color: '#ef4444' }}>{error}</p>
                    )}
                    <p className='text-sm mb-6 bodyColor'>
                        JPG, PNG, PDF, AI, EPS, SVG, or PSD. Up to 3MB.
                    </p>
                    <button
                        type='button'
                        onClick={handleSubmit}
                        className='btnColor py-3 px-8 shadow-md'
                        disabled={reading}
                    >
                        {attachment || description.trim() ? 'Continue' : 'Skip For Now'}
                    </button>
                </div>
            </div>
            <div className='h-auto imageOverlay'>
                <img
                    src={image}
                    alt='Local Threads custom artwork'
                    className='w-full h-full object-cover'
                />
                <NavBtns onBack={onBack} onNext={handleSubmit} currentStep={4} />
            </div>
        </div>
    );
};

export default ArtworkSlide;
