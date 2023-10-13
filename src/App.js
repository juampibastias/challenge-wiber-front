import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import Joi from 'joi';
import ScriptForm from './components/ScriptForm';
import LanguageDisplay from './components/LanguageDisplay';
import ScriptList from './components/ScriptList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [scripts, setScripts] = useState([]);
    const [newScript, setNewScript] = useState('');
    const [validationError, setValidationError] = useState(null);
    const [scriptLanguage, setScriptLanguage] = useState(null);
    const [editingScript, setEditingScript] = useState({
        id: null,
        name: '',
        text: '',
        date: '',
        time: '',
        versions: [],
    });

    const [scriptName, setScriptName] = useState('');

    const handleEdit = (scriptId) => {
        const scriptToEdit = scripts.find((script) => script.id === scriptId);

        if (scriptToEdit) {
            setEditingScript({
                id: scriptToEdit.id,
                name: scriptToEdit.name,
                text: scriptToEdit.text,
                date: scriptToEdit.date,
                time: scriptToEdit.time,
                versions: scriptToEdit.versions,
            });
            setNewScript(scriptToEdit.text);
            setScriptName(scriptToEdit.name);
        } else {
            console.error(`Script with id ${scriptId} not found.`);
        }
    };

    useEffect(() => {
        fetch('http://localhost:5000/api/scripts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => setScripts(data));
    }, []);

    const handleSubmit = async () => {
        try {
            if (!editingScript) {
                console.error('Error: editingScript is null or undefined');
                return;
            }

            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${
                currentDate.getMonth() + 1
            }/${currentDate.getFullYear().toString().slice(-2)}`; // Formatear la fecha como 'dd/mm/aa'

            const formattedTime = `${currentDate.getHours()}:${(
                '0' + currentDate.getMinutes()
            ).slice(-2)}`; // Formatear la hora como 'hh:mm'
            // Formatear la hora como 'hh:mm'

            const apiUrl = editingScript.id
                ? `http://localhost:5000/api/scripts/${editingScript.id}`
                : 'http://localhost:5000/api/scripts';

            const response = await fetch(apiUrl, {
                method: editingScript.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: scriptName,
                    text: newScript,
                    date: formattedDate,
                    time: formattedTime,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (editingScript.id) {
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
                    editingScript.id
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
    useEffect(() => {
        fetch('http://localhost:5000/api/scripts')
            .then((response) => response.json())
            .then((data) => setScripts(data));
    }, [scripts]);

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

            {scriptLanguage && <LanguageDisplay language={scriptLanguage} />}
            <ScriptList
                scripts={scripts}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
}

export default App;
