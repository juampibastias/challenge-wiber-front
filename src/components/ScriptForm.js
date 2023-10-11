import React from 'react';

function ScriptForm({ value, onChange, onSubmit, error }) {
    return (
        <div>
            <input type='text' value={value} onChange={onChange} />
            {error && <div className='error-message'>{error}</div>}
            <button onClick={onSubmit}>Agregar Script</button>
        </div>
    );
}

export default ScriptForm;
