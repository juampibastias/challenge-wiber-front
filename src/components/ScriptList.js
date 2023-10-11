import React from 'react';

function ScriptList({ scripts, onDelete, onEdit }) {
    return (
        <ul>
            {scripts.map((script) => (
                <li key={script.id}>
                    {script.text}{' '}
                    <button onClick={() => onEdit(script.id)}>Editar</button>
                    <button onClick={() => onDelete(script.id)}>
                        Eliminar
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default ScriptList;
