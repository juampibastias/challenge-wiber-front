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
    const [editingScript, setEditingScript] = useState(null);
    const [scriptName, setScriptName] = useState('');

    const handleEdit = (scriptId) => {
        const scriptToEdit = scripts.find((script) => script.id === scriptId);
        setEditingScript(scriptToEdit);
        setNewScript(scriptToEdit.text);
        setScriptName(scriptToEdit.name); // Asegúrate de establecer el nombre del script
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
            if (editingScript) {
                // ... (lógica para editar script)
            } else {
                const currentDate = new Date();
                const formattedDate = `${currentDate.getDate()}/${
                    currentDate.getMonth() + 1
                }/${currentDate.getFullYear().toString().slice(-2)}`; // Formatear la fecha como 'dd/mm/aa'

                const formattedTime = `${currentDate.getHours()}:${(
                    '0' + currentDate.getMinutes()
                ).slice(-2)}`; // Formatear la hora como 'hh:mm'

                const response = await fetch(
                    'http://localhost:5000/api/scripts',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: scriptName,
                            script: newScript,
                            date: formattedDate,
                            time: formattedTime,
                        }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setScripts([...scripts, data]);
                    setNewScript('');
                    setScriptName('');
                } else {
                    console.error('Error al crear el script');
                }
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
