import { useState } from 'react';
import NavBtns from '../components/NavBtns';

const ProjectSlide = ({ logo, image, onBack, onSubmit }) => {
    const [projectDetails, setProjectDetails] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!projectDetails.trim()) {
            setError('Give us a rough idea. Even a sentence helps.');
            return;
        }

        setError('');
        onSubmit(projectDetails.trim());
    };

    return (
        <div className='flex flex-col-reverse md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
            <div className='flex flex-col justify-center px-6 sm:px-12 py-6 md:pt-28 relative'>
                <div className='mb-8 fixed top-10 left-10 hidden md:block'>
                    <img src={logo} alt='Local Threads' className='ltLogo object-contain' />
                </div>

                <span className='eyebrow mb-6'>Your Project</span>

                <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    What Are We <span className='accentText'>Making?</span>
                </h1>
                <p className='text-lg mb-8 bodyColor'>
                    Describe your project. The more detail, the better your quote.
                </p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className='w-full max-w-md'
                >
                    <textarea
                        value={projectDetails}
                        onChange={(e) => {
                            setProjectDetails(e.target.value)
                            if (error) setError('');
                        }}
                        placeholder='Tell us about your project...'
                        rows={3}
                        className='textareaStyle w-full mb-2'
                    />
                    {error && (
                        <p className='text-sm mb-2' style={{ color: '#ef4444' }}>{error}</p>
                    )}
                    <p className='text-sm mb-6 bodyColor'>
                        Colors, placements, garment preferences. Whatever you've got.
                    </p>
                    <button
                        type='submit'
                        className='btnColor py-3 px-8 shadow-md'
                    >
                        Continue
                    </button>
                </form>
            </div>
            <div className='h-auto imageOverlay'>
                <img
                    src={image}
                    alt='Local Threads custom prints'
                    className='w-full h-full object-cover'
                />
                <NavBtns onBack={onBack} onNext={handleSubmit} currentStep={2} />
            </div>
        </div>
    );
};

export default ProjectSlide;
