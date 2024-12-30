// import React, { useState, useEffect } from 'react';
// import './App.css';
// import io from 'socket.io-client';

// const socket = io('http://localhost:4000');  // Connect to backend running on port 4000

// function App() {
//   const [text, setText] = useState('');

//   // On component mount, fetch the current document content from the backend
//   useEffect(() => {
//     // Listen for document content updates from the server
//     socket.on('document-update', (newContent) => {
//       setText(newContent);
//     });

//     // Clean up when the component unmounts
//     return () => {
//       socket.off('document-update');
//     };
//   }, []);

//   // Emit document changes to the server
//   const handleTextChange = (event) => {
//     const newText = event.target.value;
//     setText(newText);  // Update the text locally
//     socket.emit('document-change', newText);  // Emit changes to the server
//   };

//   return (
//     <div className="App">
//       <h1>Real-Time Document Editor</h1>
//       <textarea
//         value={text}
//         onChange={handleTextChange}
//         placeholder="Start typing here..."
//         rows="20"
//         cols="80"
//       />
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');  // Connect to backend running on port 4000

function App() {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const textareaRef = useRef(null);  // Reference for the textarea

  // On component mount, fetch the current document content from the backend
  useEffect(() => {
    socket.on('document-update', (newContent) => {
      setText(newContent);
    });

    return () => {
      socket.off('document-update');
    };
  }, []);

  // Emit document changes to the server
  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);  // Update the text locally
    socket.emit('document-change', newText);  // Emit changes to the server
  };

  // Handle Bold formatting
  const handleBold = () => {
    setIsBold((prev) => !prev);
    document.execCommand('bold');  // Toggle bold formatting for selected text
  };

  // Handle Italic formatting
  const handleItalic = () => {
    setIsItalic((prev) => !prev);
    document.execCommand('italic');  // Toggle italic formatting for selected text
  };

  // Handle Underline formatting
  const handleUnderline = () => {
    setIsUnderline((prev) => !prev);
    document.execCommand('underline');  // Toggle underline formatting for selected text
  };

  // Handle Font Size change
  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  return (
    <div className="App">
      <h1>Real-Time Document Editor</h1>

      <div className="controls">
        <button onClick={handleBold} style={{ fontWeight: isBold ? 'bold' : 'normal' }}>
          <b>B</b>
        </button>
        <button onClick={handleItalic} style={{ fontStyle: isItalic ? 'italic' : 'normal' }}>
          <i>I</i>
        </button>
        <button onClick={handleUnderline} style={{ textDecoration: isUnderline ? 'underline' : 'none' }}>
          <u>U</u>
        </button>

        <select onChange={handleFontSizeChange} value={fontSize}>
          <option value={12}>12px</option>
          <option value={14}>14px</option>
          <option value={16}>16px</option>
          <option value={18}>18px</option>
          <option value={20}>20px</option>
        </select>
      </div>

      {/* Use a simple textarea instead of contenteditable div */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        placeholder="Start typing here..."
        rows="20"
        cols="80"
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderline ? 'underline' : 'none',
        }}
      />
    </div>
  );
}

export default App;
