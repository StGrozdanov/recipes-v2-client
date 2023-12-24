import { Route, Routes } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Footer from "./components/Footer/Footer";
import { QueryClient, QueryClientProvider } from "react-query";
import { queryConfig } from "./configs/reactQueryConfig";

const queryClient = new QueryClient(queryConfig);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/' element={<Landing />} />
      </Routes>
      <Footer />
    </QueryClientProvider>
  );
}

export default App;
