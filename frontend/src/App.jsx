import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // <-- Import the Navbar
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';

function App() {
  return (
    <Router>
      {/* Added dark:bg-slate-950 and dark:text-slate-50 for global dark mode! */}
      {/* Also added transition-colors so it fades smoothly */}
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-50 font-sans antialiased transition-colors duration-300">
        
        {/* Render the Navbar so you can actually click the toggle button */}
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateTicket />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;