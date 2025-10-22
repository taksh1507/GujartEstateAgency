import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SavedPropertiesProvider } from './context/SavedPropertiesContext';
import EntranceVideo from './components/EntranceVideo';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [showEntrance, setShowEntrance] = useState(true);

  const handleEntranceComplete = () => {
    setShowEntrance(false);
  };

  // Auto-skip entrance video after 7 seconds as ultimate fallback (reduced due to smaller video size)
  useEffect(() => {
    const ultimateFallback = setTimeout(() => {
      console.warn('Ultimate fallback: Skipping entrance video');
      setShowEntrance(false);
    }, 7000);

    return () => clearTimeout(ultimateFallback);
  }, []);

  if (showEntrance) {
    return <EntranceVideo onComplete={handleEntranceComplete} />;
  }

  return (
    <AuthProvider>
      <SavedPropertiesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="properties" element={<Properties />} />
              <Route path="property/:id" element={<PropertyDetails />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            {/* Admin routes without main layout */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
              error: {
                duration: 4000,
                theme: {
                  primary: '#f56565',
                },
              },
            }}
          />
        </Router>
      </SavedPropertiesProvider>
    </AuthProvider>
  );
}

export default App;
