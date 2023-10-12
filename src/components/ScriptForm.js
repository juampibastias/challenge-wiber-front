import React from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

function ScriptForm({ value, scriptName, onNameChange, onChange, onSubmit }) {
    const handleEditClick = async (scriptId, scriptText) => {
        try {
            const { value: updatedScript } = await Swal.fire({
                title: 'Editar Script',
                input: 'text',
                inputValue: scriptText,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debes ingresar un script';
                    }
                },
            });

            if (updatedScript) {
                const response = await fetch(
                    `http://localhost:5000/api/scripts/${scriptId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ script: updatedScript }),
                    }
                );

                if (response.ok) {
                    Swal.fire(
                        '¡Éxito!',
                        'Script actualizado correctamente.',
                        'success'
                    );
                    // Recargar la lista de scripts después de la actualización
                    window.location.reload();
                } else {
                    console.error('Error al actualizar el script');
                    Swal.fire(
                        'Error',
                        'No se pudo actualizar el script.',
                        'error'
                    );
                }
            }
        } catch (error) {
            console.error('Error de red:', error);
            Swal.fire(
                'Error',
                'Error de red al intentar actualizar el script.',
                'error'
            );
        }
    };

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
