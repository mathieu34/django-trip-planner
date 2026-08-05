import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Attraction from "./pages/Attraction";
import Compilation from "./pages/Compilation";
import Navbar from "./components/Navbar";
import './App.css'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/attraction/:id" element={<Attraction />} />
        <Route path="/compilation" element={<Compilation />} />
      </Routes>
    </>
  );
}

export default App
