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
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
