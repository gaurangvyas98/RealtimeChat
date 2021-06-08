import ApolloProvider from './ApolloProvider';
import { Container } from 'react-bootstrap'
import './App.scss';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { AuthProvider, useAuthState } from './context/authContext';
import Home from './pages/home/Home'
import Register from './pages/register'
import Login from './pages/login'

//redirect user based on authentication
const DynamicRoute=(props)=>{
  const { user } = useAuthState()

  if (props.authenticated && !user) {
    return <Redirect to="/login" />
  } 
  else if (props.guest && user) {
    return <Redirect to="/" />
  } 
  else {
    return <Route component={props.component} {...props} />
  }
}

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container>
            <Switch>
              <DynamicRoute exact path="/" component={Home} authenticated />
              <DynamicRoute path="/register" component={Register} guest />
              <DynamicRoute path="/login" component={Login} guest />
            </Switch>
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
