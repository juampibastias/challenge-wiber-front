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
        fetch('http://localhost:5000/api/scripts')
            .then((response) => response.json())
            .then((data) => setScripts(data));
    }, []);

    const handleInputChange = (e) => {
        const script = e.target.value;
        setNewScript(script);

        // Especifica el lenguaje aquí (por ejemplo, 'javascript' o 'python')
        const language = Prism.highlight(script, Prism.languages.javascript);
        setScriptLanguage(language);

        // Validación del script usando Joi
        const validationSchema = Joi.string().required();
        const { error } = validationSchema.validate(script);

        if (error) {
            setValidationError(error.message);
        } else {
            setValidationError(null);
        }
    };

    const handleSubmit = async () => {
        try {
            if (editingScript) {
                // Si hay un script en edición, realiza una solicitud PUT para actualizar el script existente
                const response = await fetch(
                    `http://localhost:5000/api/scripts/${editingScript.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ script: newScript }),
                    }
                );

                if (response.ok) {
                    // Si la actualización fue exitosa, actualiza el script en el estado y la lista de scripts
                    const updatedScript = await response.json();
                    setScripts(
                        scripts.map((script) =>
                            script.id === editingScript.id
                                ? updatedScript
                                : script
                        )
                    );

                    setEditingScript(null);
                    setNewScript('');
                } else {
                    console.error('Error al actualizar el script');
                }
            } else {
                // Si no hay un script en edición, realiza una solicitud POST para crear un nuevo script
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
                        }),
                    }
                );

                if (response.ok) {
                    // Si la creación fue exitosa, agrega el nuevo script al estado de los scripts
                    const data = await response.json();
                    setScripts([...scripts, data]);
                    setNewScript('');
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
                onEditClick={handleEdit} // Asegúrate de pasar handleEdit como onEditClick
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
