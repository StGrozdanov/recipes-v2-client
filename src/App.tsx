import { Route, Routes, useLocation } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Footer from "./components/Footer/Footer";
import { QueryClient, QueryClientProvider, dehydrate, hydrate } from "react-query";
import { queryConfig } from "./configs/reactQueryConfig";
import Navigation from "./components/Navigation/Navigation";
import Catalogue from "./components/Catalogue/Catalogue";
import Search from "./components/Search/Search";
import Category from "./components/Category/Category";
import Login from "./components/Authentication/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./components/Authentication/Register";
import { InputModalProvider } from "./contexts/InputModalContext";
import PasswordReset from "./components/Authentication/PasswordReset";
import RecipeDetails from "./components/RecipeDetails/RecipeDetails";
import UserProfile from "./components/UserProfile/UserProfile";

const queryClient = new QueryClient(queryConfig);
// If the mutation has been paused because the device is for example offline,
// Then the paused mutation can be dehydrated when the application quits:
const state = dehydrate(queryClient)
// The mutation can then be hydrated again when the application is started:
hydrate(queryClient, state)
// Resume the paused mutations:
queryClient.resumePausedMutations()

function App() {
  const location = useLocation();
  const currentPage = location.pathname;
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {currentPage !== '/' && <Navigation />}
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/catalogue' element={<Catalogue />} />
          <Route path='/search' element={<Search />} />
          <Route path='/category' element={<Category />} />
          <Route path='/login' element={
            <InputModalProvider>
              <Login />
            </InputModalProvider>
          } />
          <Route path='/register' element={<Register />} />
          <Route path='/reset-password/:id' element={<PasswordReset />} />
          <Route path='/details/:name' element={<RecipeDetails />} />
          <Route path='/details/:name/comments' element={<RecipeDetails />} />
          <Route path='/user/:username' element={<UserProfile />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
