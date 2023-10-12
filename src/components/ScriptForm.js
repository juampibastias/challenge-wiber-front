import React from 'react';
import Swal from 'sweetalert2';

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
                console.log(response);
                if (response.ok) {
                    Swal.fire(
                        '¡Éxito!',
                        'Script actualizado correctamente.',
                        'success'
                    );
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
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <input
                    type='text'
                    placeholder='Nombre del script'
                    value={scriptName}
                    onChange={onNameChange}
                />
                <textarea
                    style={{ padding: '20%' }}
                    type='text'
                    value={value}
                    onChange={onChange}
                    placeholder='Ingresa aquí tu script'
                />
                {error && <div className='error-message'>{error}</div>}
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px',
                }}
            >
                <button onClick={onSubmit}>Agregar Script</button>
            </div>
        </div>
    );
}

export default ScriptForm;
