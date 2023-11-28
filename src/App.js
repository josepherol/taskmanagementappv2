import { MainProvider } from "./hooks/MainContext";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Projeler from "./pages/Projeler";
import Gorevler from "./pages/Gorevler";
import AllTasks from "./pages/AllTasks";

function App() {
  return (
    <MainProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projects" element={<Projeler />} />
            <Route path="/tasks" element={<Gorevler />} />
            <Route path="/alltasks" element={<AllTasks />} />
          </Routes>
        </div>
      </Router>
    </MainProvider>
  );
}

export default App;
