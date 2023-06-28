import "./App.css";
import Navbar from "./components/Navbar";
import AddTask from "./components/AddTask";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<AddTask />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
