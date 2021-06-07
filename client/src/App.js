import ApolloProvider from './ApolloProvider';
import { Container } from 'react-bootstrap'
import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'

function App() {
  return (
    <ApolloProvider>
        <BrowserRouter>
          <Container className="pt-5">
            <Switch>
              <Route exact path="/" component={Home} authenticated />
              <Route path="/register" component={Register} guest />
              <Route path="/login" component={Login} guest />
            </Switch>
          </Container>
        </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
