import { ToastContainer } from "react-toastify";
import "./App.css";
import Router from "./routes/routes";
const App = () => {
  return (
    <div className="App">
      <ToastContainer />

      <Router />
    </div>
  );
};
export default App;
