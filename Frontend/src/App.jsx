import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
// import SignInButton from "/compo"

function App() {
  return (
    <>
      <Router>
        <Background />
        <Navbar />
        <main className="relative">
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
