import React from 'react';

function LanguageDisplay({ language }) {
    return (
        <div>
            <h2>Lenguaje del Script Detectado:</h2>
            <pre>
                <code className='language-auto'>{language}</code>
            </pre>
        </div>
    );
}

export default LanguageDisplay;
