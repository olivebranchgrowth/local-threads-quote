const NavBtns = ({ onBack, onNext, showBack = true, currentStep = 0, totalSteps = 6 }) => {
    return (
        <div className='fixed bottom-6 right-6 flex items-center gap-4 z-10'>
            <div className='flex gap-2 mr-2'>
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`progressDot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                    />
                ))}
            </div>
            {showBack && (
                <button
                    onClick={onBack}
                    className='navBtn'
                    aria-label='Previous step'
                >
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M19 12H5M12 19l-7-7 7-7' />
                    </svg>
                </button>
            )}
            <button
                onClick={onNext}
                className='navBtn'
                aria-label='Next step'
            >
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M5 12h14M12 5l7 7-7 7' />
                </svg>
            </button>
        </div>
    );
};

export default NavBtns;
