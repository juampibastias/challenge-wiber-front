import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function ScriptForm({
    value,
    scriptName,
    onNameChange,
    onChange,
    onSubmit,
    error,
    onEditClick,
    scriptId,
}) {
    return (
        <div className='d-flex justify-content-center'>
            <form className='was-validated w-50 justify-content-center'>
                <div>
                    <label htmlFor='scriptNameInput' className='form-label'>
                        Dale un nombre a tu script.
                    </label>
                    <input
                        id='scriptNameInput'
                        className='form-control'
                        type='text'
                        placeholder='Nombre del script'
                        value={scriptName}
                        onChange={onNameChange}
                    />
                </div>
                <div className='mb-3 mt-5'>
                    <label htmlFor='scriptTextInput' className='form-label'>
                        Escribe aquí tu script.
                    </label>
                    <textarea
                        id='scriptTextInput'
                        className='form-control'
                        type='text'
                        value={value}
                        onChange={onChange}
                        placeholder='Ingresa aquí tu script'
                    ></textarea>
                </div>

                <div className='mb-3'>
                    <button
                        className='btn btn-primary'
                        type='button'
                        onClick={onSubmit}
                    >
                        Agregar script
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ScriptForm;
