import { RouterProvider } from "react-router-dom";
import { router } from "../Router";
import AuthProvider from "./contexts/AuthProvider";
import StatusProvider from "./pages/student/StatusContext";
function App() {
  return (
    <AuthProvider>
      <StatusProvider>
        <div className="relative">
        </div>
        <RouterProvider router={router} />
      </StatusProvider>
    </AuthProvider>
  );
}

export default App;
