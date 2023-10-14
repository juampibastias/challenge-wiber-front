import React from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './ScriptList.css';

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
    const handleDeleteClick = (scriptId, scriptName) => {
        // Mostrar un SweetAlert para confirmar la eliminación
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Estás a punto de eliminar el script "${scriptName}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Llamada a la función onDelete con el ID del script
                onDelete(scriptId);
            }
        });
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-50 mt-5 mb-5'>
            <table className='table w-50'>
                <thead>
                    <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Nombre</th>
                        <th scope='col'>Fecha</th>
                        <th scope='col'>Hora</th>
                        <th scope='col'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {scripts.map((script, index) => (
                        <tr key={script.id}>
                            <th scope='row'>{index + 1}</th>
                            <td>
                                <span
                                    onClick={() =>
                                        handleEditClick(script.id, script.text)
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                    }}
                                >
                                    {script.name}
                                </span>
                            </td>
                            <td>{script.date}</td>
                            <td>{script.time}</td>
                            <td>
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    onClick={() => {
                                        handleDeleteClick(script.id);
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        color: 'red',
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ScriptList;
