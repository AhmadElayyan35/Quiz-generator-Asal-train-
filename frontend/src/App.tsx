import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Login from './components/Identity/Login/Login';
import SignUp from './components/Identity/SignUp/SignUp';
import Nav from './components/Nav/Nav';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Quiz from './components/QuizGenerator/Quiz';
import { Basic } from './components/Dashboard/User/Dashboard';
import { Categories } from './components/Categories/Categories';
import Category from './components/Category/Category';
import AvailableQuiz from './components/Quizzes/AvailableQuiz';
import Attempt from './components/Quizzes/Attempt';
import { useContext, useEffect } from 'react';
import { TokenContext } from './context/TokenContext';
import ProtectedRoute from './authorization/ProtectedRoute';
import NotFound from './components/NotFound';
import Documents from './components/Documents/Documents';
import Quizzes from './components/Quizzes/Quizzes';
import Attempts from './components/Quizzes/Attempts';
function App() {
  const { token, setToken } = useContext(TokenContext);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' && !event.newValue) {
        handleLogout();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <HowItWorks />
            <Features />
            <Footer />
          </>
        } />
        <Route path="/signup" element={!token ? <SignUp /> : <Navigate to='/dashboard' />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to='/dashboard' />} />
        <Route path='categories/:id/view-quiz' element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        } />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Basic />
          </ProtectedRoute>
        } />
        <Route path='/categories' element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        } />
        <Route path='/categories/:id' element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        } />
        <Route path='/categories/:categoryId/quizzes/:quizId' element={
          <ProtectedRoute>
            <AvailableQuiz />
          </ProtectedRoute>
        } />
        <Route path='/categories/:categoryId/attempts/:attemptId' element={
          <ProtectedRoute>
            <Attempt />
          </ProtectedRoute>
        } />
        <Route path='/documents' element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        } />
        <Route path='/quizzes' element={
          <ProtectedRoute>
            <Quizzes />
          </ProtectedRoute>
        } />
        <Route path='/attempts' element={
          <ProtectedRoute>
            <Attempts />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
