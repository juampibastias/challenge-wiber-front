import React from 'react';
import Swal from 'sweetalert2';

function ScriptList({ scripts, onDelete }) {
    const handleEditClick = (scriptId, scriptText) => {
        Swal.fire({
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
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedScript = result.value; // Nuevo texto del script editado

                // Realizar una solicitud PUT para actualizar el script en el servidor
                fetch(`http://localhost:5000/api/scripts/${scriptId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ script: updatedScript }),
                })
                    .then((response) => {
                        if (response.ok) {
                            // Si la solicitud es exitosa, mostrar SweetAlert de éxito
                            Swal.fire(
                                '¡Éxito!',
                                'Script actualizado correctamente.',
                                'success'
                            );
                            // Actualizar el estado si es necesario
                            // Tu código aquí para actualizar el estado si es necesario
                        } else {
                            // Si hay un error en la solicitud, mostrar SweetAlert de error
                            Swal.fire(
                                'Error',
                                'No se pudo actualizar el script.',
                                'error'
                            );
                        }
                        return response.json();
                    })
                    .catch((error) => {
                        console.error('Error al actualizar el script:', error);
                        // Mostrar SweetAlert de error si hay un error en la solicitud
                        Swal.fire(
                            'Error',
                            'No se pudo actualizar el script.',
                            'error'
                        );
                    });
            }
        });
    };

    return (
        <div style={{ marginTop: '5rem' }}>
            <ul>
                {scripts.map((script) => (
                    <li key={script.id}>
                        <span
                            onClick={() =>
                                handleEditClick(script.id, script.text)
                            }
                            style={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                        >
                            {script.name} {/* Mostrar el nombre del script */}
                        </span>
                        <button onClick={() => onDelete(script.id)}>
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ScriptList;
