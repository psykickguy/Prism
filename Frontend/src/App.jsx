import "./App.css";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
// import SignInButton from "/compo"

function App() {
  return (
    <>
      {/* <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header> */}
      <Background />
      <Navbar />
    </>
  );
}

export default App;
