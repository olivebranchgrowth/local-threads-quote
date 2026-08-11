const ConfirmSlide = ({ logo, image }) => {
    return (
        <div className='flex flex-col-reverse md:grid md:grid-cols-2 bgColor h-screen overflow-y-auto relative'>
            <div className='flex flex-col justify-center px-6 sm:px-12 py-6 md:pt-28 relative'>
                <div className='mb-8 fixed top-10 left-10 hidden md:block'>
                    <img src={logo} alt='Local Threads' className='ltLogo object-contain' />
                </div>

                <div className='mb-6' style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                    <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='var(--lt-rust)' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
                        <polyline points='22 4 12 14.01 9 11.01' />
                    </svg>
                    <span className='eyebrow' style={{ marginBottom: 0 }}>Request Received</span>
                </div>

                <h1 className='text-xl sm:text-4xl font-bold mb-4 leading-snug headingColor' style={{ textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    You're <span className='accentText'>All Set.</span>
                </h1>

                <p className='text-lg mb-4 bodyColor'>
                    We've got your info and we're on it. Expect to hear from the Local Threads team soon.
                </p>
                <p className='text-lg mb-8 bodyColor'>
                    In the meantime, give us a call if you want to talk it through.
                </p>

                <div className='flex flex-wrap gap-4'>
                    <a
                        href='tel:6147259005'
                        className='btnColor inline-flex items-center gap-2 py-3 px-8 shadow-md'
                        style={{ textDecoration: 'none' }}
                    >
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                        </svg>
                        (614) 725-9005
                    </a>
                    <a
                        href='https://www.localthreadsohio.com'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='btnOutline inline-flex items-center gap-2 py-3 px-8'
                        style={{ textDecoration: 'none' }}
                    >
                        Visit Our Site
                    </a>
                </div>

                <div className='mt-10 pt-6' style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className='text-sm bodyColor'>
                        <strong style={{ color: '#ffffff' }}>Local Threads</strong> &middot; 955 Checkrein Ave, Columbus, OH 43229
                    </p>
                    <p className='text-sm bodyColor'>ryan@localthreadsohio.com</p>
                </div>
            </div>
            <div className='h-auto imageOverlay'>
                <img
                    src={image}
                    alt='Local Threads'
                    className='w-full h-full object-cover'
                />
            </div>
        </div>
    );
};

export default ConfirmSlide;
