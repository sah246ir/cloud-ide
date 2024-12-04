import { Route, Routes } from "react-router-dom";
import CodeSandbox from "./pages/codeSandbox";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { SandboxContext } from "./context/sandboxContext";
import SandboxDialog from "./components/sandboxDialog";

function App() { 
  return (
    // <SandboxContext.Provider value='13.234.225.201:8080'>
    // <SandboxContext.Provider value='13.126.33.47:8080'>
    // <SandboxContext.Provider value='172.17.0.2:8080'>
    <main className="bg-gray-950">
        <Navbar />
        <Routes>
        <Route index element={<Home />} />
        <Route path="/sandbox/:id" element={<CodeSandbox />} />
      </Routes>
      
    </main>
  );
}

export default App;
