import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer';
import useAuth from './hooks/useAuth'; // Import custom auth hook

const Layout = lazy(() => import('./containers/Layout'));
const Login = lazy(() => import('./pages/Login'));
const CreateAccount = lazy(() => import('./pages/CreateAccount'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

function App() {
    const { isAuthenticated } = useAuth(); // Check authentication status

    useEffect(() => {
      console.log('ok')      
  }, [isAuthenticated]);

    return (
        <Router>
            <AccessibleNavigationAnnouncer />
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    {/* Public Routes */}
                    <Route path="/login" component={Login} />
                    <Route path="/create-account" component={CreateAccount} />
                    <Route path="/forgot-password" component={ForgotPassword} />
                    <Route path="/create-account" component={CreateAccount} />

                    {/* Conditionally Render Protected Routes */}
                    <Route path="/app" render={() => (
                        isAuthenticated ? <Layout /> : <Redirect to="/login" />
                    )} />

                    {/* Redirect all other routes to login */}
                    <Redirect exact from="/" to="/login" />
                </Switch>
            </Suspense>
        </Router>
    );
}

export default App;
