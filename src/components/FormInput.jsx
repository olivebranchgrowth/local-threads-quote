const FormInput = ({
    value,
    onChange,
    onSubmit,
    placeholder = 'Type your answer here...',
    buttonLabel = 'OK',
    showButton = true,
    disabled = false,
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            onSubmit(value.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full max-w-md'>
            <input
                type='text'
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className='inputStyle w-full mb-6'
            />
            {showButton && (
                <button
                    type='submit'
                    disabled={disabled}
                    className='btnColor py-3 px-8 shadow-md disabled:opacity-50'
                >
                    {buttonLabel}
                </button>
            )}
        </form>
    );
};

export default FormInput;
