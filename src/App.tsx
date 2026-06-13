import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Dashboard } from '@/pages/Dashboard';
import { Ingredients } from '@/pages/Ingredients';
import { Recipes } from '@/pages/Recipes';
import { Expiring } from '@/pages/Expiring';
import { BottomNav } from '@/components/BottomNav';

function PageWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  return (
    <div className="relative">
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/expiring" element={<Expiring />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </PageWrapper>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
