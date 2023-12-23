import { Route, Routes } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Footer from "./components/Footer/Footer";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message === 'Failed to fetch') {
          // Disable retries for 'Failed to fetch' error. In cases such as 404, bad network, CORS - there is no need to refetch
          return false;
        }
        // Retry for other errors
        return failureCount <= 3;
      },
      retryDelay: attemptIndex => Math.min(600 * 2 ** attemptIndex, 2000), // retry a failed request for 3 seconds only
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 15, // 15 minutes
      cacheTime: 1000 * 60 * 15, // 15 minutes
    }
  }
});

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
