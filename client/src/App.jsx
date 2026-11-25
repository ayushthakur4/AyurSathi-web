import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BackgroundBlobs from "./components/BackgroundBlobs";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative flex min-h-screen flex-col">
        <BackgroundBlobs />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
