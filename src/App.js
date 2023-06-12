import "./App.css";
import Navbar from "./components/Navbar";
import TaskInput from "./components/TaskInput";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<TaskInput />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
