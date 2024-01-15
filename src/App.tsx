import { Route, Routes, useLocation } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Footer from "./components/Footer/Footer";
import { QueryClient, QueryClientProvider, dehydrate, hydrate } from "react-query";
import Navigation from "./components/Navigation/Navigation";
import Catalogue from "./components/Catalogue/Catalogue";
import Search from "./components/Search/Search";
import Category from "./components/Category/Category";
import { AuthProvider } from "./contexts/AuthContext";
import Register from "./components/Authentication/Register";
import { InputModalProvider } from "./contexts/InputModalContext";
import RecipeDetails from "./components/RecipeDetails/RecipeDetails";
import { ModalProvider } from "./contexts/ModalContext";
import { BlockedContextProvider } from "./contexts/BlockedContext";
import { queryConfig } from "./configs/reactQueryConfig";
import useWebSocket from "react-use-websocket";
import AuthRoute from "./components/common/AuthRoute/AuthRoute";
import RecipeOwnerRoute from "./components/common/OwnerRoute/OwnerRoute";
import { Suspense, lazy } from 'react';
import LoadingPan from "./components/common/LoadingPan/LoadingPan";
import Page404 from "./components/common/404/404";

const PasswordReset = lazy(() => import('./components/Authentication/PasswordReset'));
const UserProfile = lazy(() => import('./components/UserProfile/UserProfile'));
const Profile = lazy(() => import('./components/Profile/modules/Profile/Profile'));
const Notifications = lazy(() => import('./components/Profile/modules/Notifications/Notifications'));
const FavouriteRecipes = lazy(() => import('./components/Profile/modules/FavouriteRecipes/FavouriteRecipes'));
const MyRecipes = lazy(() => import('./components/Profile/modules/MyRecipes/MyRecipes'));
const ProfileEdit = lazy(() => import('./components/Profile/modules/ProfileEdit/ProfileEdit'));
const CreateRecipe = lazy(() => import('./components/CreateRecipe/CreateRecipe'));
const EditRecipe = lazy(() => import('./components/EditRecipe/EditRecipe'));
const ProfileRoot = lazy(() => import('./components/Profile/ProfileRoot'));
const Login = lazy(() => import('./components/Authentication/Login'));

const queryClient = new QueryClient(queryConfig);
// If the mutation has been paused because the device is for example offline,
// Then the paused mutation can be dehydrated when the application quits:
const state = dehydrate(queryClient);
// The mutation can then be hydrated again when the application is started:
hydrate(queryClient, state);
// Resume the paused mutations:
queryClient.resumePausedMutations();
const NOTIFICATIONS_WEBSOCKET_URL = process.env.REACT_APP_BACKEND_WEBSOCKET_URL;

function App() {
  const { pathname } = useLocation();
  useWebSocket(NOTIFICATIONS_WEBSOCKET_URL!, {
    shouldReconnect: (_closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) => {
      let usernames: string[] = [];
      try {
        usernames = JSON.parse(event.data);
      } catch (err) {
        console.info(event.data)
      }
      usernames.forEach(username => queryClient.invalidateQueries(['userNotifications', username]));
    },
    reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 2000, 10000),
    reconnectAttempts: 10,
    share: true,
  });

  return (
    <main style={{overflowX: "hidden"}}>
      <BlockedContextProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {pathname !== '/' && <Navigation />}
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/catalogue' element={<Catalogue />} />
              <Route path='/search' element={<Search />} />
              <Route path='/category' element={<Category />} />
              <Route path='/login' element={
                <Suspense fallback={<LoadingPan />}>
                  <InputModalProvider>
                    <Login />
                  </InputModalProvider>
                </Suspense>
              } />
              <Route path='/register' element={<Register />} />
              <Route path='/reset-password/:id' element={
                <Suspense fallback={<LoadingPan />}>
                  <PasswordReset />
                </Suspense>
              } />
              <Route path='/details/:name' element={
                <ModalProvider >
                  <RecipeDetails />
                </ModalProvider>
              } />
              <Route path='/details/:name/comments' element={
                <ModalProvider >
                  <RecipeDetails />
                </ModalProvider>
              } />
              <Route path='/user/:username' element={
                <Suspense fallback={<LoadingPan />}>
                  <UserProfile />
                </Suspense>
              } />
              <Route path='/profile' element={
                <Suspense fallback={<LoadingPan />}>
                  <ProfileRoot>
                    <Profile />
                  </ProfileRoot>
                </Suspense>
              } />
              <Route path='/profile/notifications' element={
                <Suspense fallback={<LoadingPan />}>
                  <ProfileRoot>
                    <Notifications />
                  </ProfileRoot>
                </Suspense>
              } />
              <Route path='/profile/favourite-recipes' element={
                <Suspense fallback={<LoadingPan />}>
                  <ProfileRoot>
                    <FavouriteRecipes />
                  </ProfileRoot>
                </Suspense>
              } />
              <Route path='/profile/my-recipes' element={
                <Suspense fallback={<LoadingPan />}>
                  <ProfileRoot>
                    <MyRecipes />
                  </ProfileRoot>
                </Suspense>
              } />
              <Route path='/profile/edit' element={
                <Suspense fallback={<LoadingPan />}>
                  <ProfileRoot>
                    <ModalProvider >
                      <ProfileEdit />
                    </ModalProvider>
                  </ProfileRoot>
                </Suspense>
              } />
              <Route path='/create' element={
                <Suspense fallback={<LoadingPan />}>
                  <AuthRoute>
                    <CreateRecipe />
                  </AuthRoute>
                </Suspense>
              } />
              <Route path='/edit/:name' element={
                <Suspense fallback={<LoadingPan />}>
                  <RecipeOwnerRoute>
                    <EditRecipe />
                  </RecipeOwnerRoute>
                </Suspense>
              } />
              <Route path='*' element={<Page404 />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </QueryClientProvider>
      </BlockedContextProvider>
    </main>
  );
}

export default App;
