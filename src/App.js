import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import Joi from 'joi';
import ScriptForm from './components/ScriptForm';
import ScriptList from './components/ScriptList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [scripts, setScripts] = useState([]);
    const [newScript, setNewScript] = useState('');
    const [validationError, setValidationError] = useState(null);
    const [scriptName, setScriptName] = useState('');
    const [editingScript, setEditingScript] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/scripts')
            .then((response) => response.json())
            .then((data) => setScripts(data));
    }, []);

    const handleEdit = (scriptId) => {
        const scriptToEdit = scripts.find((script) => script.id === scriptId);
        if (scriptToEdit) {
            setEditingScript(scriptToEdit);
            setNewScript(scriptToEdit.text);
            setScriptName(scriptToEdit.name);
        } else {
            console.error(`Script with id ${scriptId} not found.`);
        }
    };

    const handleSubmit = async () => {
        try {
            const apiUrl = editingScript
                ? `http://localhost:5000/api/scripts/${editingScript.id}`
                : 'http://localhost:5000/api/scripts';

            const response = await fetch(apiUrl, {
                method: editingScript ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: scriptName,
                    text: newScript,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (editingScript) {
                    // Si es una edición, actualiza el script existente en el estado
                    setScripts(
                        scripts.map((script) =>
                            script.id === editingScript.id ? data : script
                        )
                    );
                } else {
                    // Si es una creación, agrega el nuevo script al estado
                    setScripts([...scripts, data]);
                }

                // Restablece los estados de edición y nuevos scripts
                setEditingScript(null);
                setNewScript('');
                setScriptName('');
            } else {
                console.error(
                    editingScript
                        ? 'Error al actualizar el script'
                        : 'Error al crear el script'
                );
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    const handleDelete = async (scriptId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/scripts/${scriptId}`,
                {
                    method: 'DELETE',
                }
            );

            if (response.ok) {
                setScripts(scripts.filter((script) => script.id !== scriptId));
            } else {
                console.error('Error al eliminar el script');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    return (
        <div className='App'>
            <div
                className='logo-img'
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <img
                    src='./ADD-removebg-preview.png'
                    className='img-fluid'
                    alt='Logo'
                />
            </div>
            <ScriptForm
                scriptName={scriptName}
                onNameChange={(e) => setScriptName(e.target.value)}
                value={newScript}
                onChange={(e) => setNewScript(e.target.value)}
                onSubmit={handleSubmit}
                error={validationError}
                onEditClick={handleEdit}
                scriptId={editingScript ? editingScript.id : null}
            />
            <ScriptList
                scripts={scripts}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
}

export default App;
