import { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';  // Pastikan ini valid jika Sidebar ada
import LoginForm from './LoginForm';  // Mengimpor LoginForm

function App() {
  const [count, setCount] = useState(0);

const function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Sidebar />  {/* Menampilkan Sidebar */}
      <LoginForm />  {/* Menampilkan LoginForm */}
    </>
  );
}

export default App;
