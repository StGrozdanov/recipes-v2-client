import { Route, Routes, useLocation } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Footer from "./components/Footer/Footer";
import { QueryClient, QueryClientProvider } from "react-query";
import { queryConfig } from "./configs/reactQueryConfig";
import Navigation from "./components/Navigation/Navigation";
import Catalogue from "./components/Catalogue/Catalogue";

const queryClient = new QueryClient(queryConfig);

function App() {
  const location = useLocation();
  const currentPage = location.pathname;
  return (
    <QueryClientProvider client={queryClient}>
      {currentPage !== '/' && <Navigation />}
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/catalogue' element={<Catalogue />} />
      </Routes>
      <Footer />
    </QueryClientProvider>
  );
}

export default App;
