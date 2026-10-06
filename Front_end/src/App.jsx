import { Outlet } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Navbar />
        <Outlet />
      </Layout>
    </AuthProvider>
  );
}

export default App;