import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Import from "./pages/Import";
import Vault from "./pages/Vault";
// import SignInButton from "/components/SignInButton";

function App() {
  return (
    <>
      <Router>
        <Background />
        <Navbar />
        <main className="relative">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/import" element={<Import />} />
            <Route path="/vault" element={<Vault />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
