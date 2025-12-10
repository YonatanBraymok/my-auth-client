import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [secretData, setSecretData] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    const endpoint = isLoginMode ? 'login' : 'register';
    
    try {
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLoginMode) {
          setToken(data.accessToken);
          setSecretData('');
        } else {
          alert("Registration Successful! Please log in.");
          setIsLoginMode(true); 
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Connection error');
    }
  };

  const fetchPrivateData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/private', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSecretData(data.message + " " + (data.secret || ''));
      } else {
        setSecretData("Error: " + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUsername('');
    setPassword('');
    setSecretData('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1>{token ? 'Dashboard' : (isLoginMode ? 'Login' : 'Register')}</h1>
      
      {token ? (
        <div style={{ backgroundColor: '#0b8b71ff', padding: '20px', borderRadius: '8px' }}>
          <h3>Hello, {username}!</h3>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            <button onClick={fetchPrivateData} style={{backgroundColor: '#780662ff', padding: '8px', cursor: 'pointer' }}>
              Get Secret Data
            </button>
            
            <button onClick={handleLogout} style={{ backgroundColor: '#0b6c33ff', padding: '8px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>

          {secretData && (
            <div style={{ border: '1px dashed #2c7a7b', padding: '10px', marginTop: '10px', backgroundColor: '#0a6610ff' }}>
              <strong>Server says:</strong> <br/>
              {secretData}
            </div>
          )}

        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <input 
                type="text" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" style={{ 
              padding: '10px', 
              backgroundColor: isLoginMode ? '#3182ce' : '#38a169',
              color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold'
            }}>
              {isLoginMode ? 'Login' : 'Register'}
            </button>
            <p style={{ marginTop: '20px', fontSize: '14px' }}>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLoginMode(!isLoginMode)} style={{ color: '#4980cdff', cursor: 'pointer', textDecoration: 'underline' }}>
              {isLoginMode ? 'Register here' : 'Login here'}
            </span>
          </p>
        </form>
      )}
    </div>
  );
}

export default App;