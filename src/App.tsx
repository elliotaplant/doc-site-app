import './App.css';

function App() {
  const getDriveAuthURl = async () => {
    const something = await fetch('/.netlify/functions/drive-auth-url');
    const { url } = await something.json();
    console.log('url', url);
  };

  return (
    <div className="App">
      <button onClick={getDriveAuthURl}>Get Drive Auth URL</button>
    </div>
  );
}

export default App;
