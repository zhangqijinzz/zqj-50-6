import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Carrot, UtensilsCrossed, AlertTriangle } from 'lucide-react';

const navItems = [
  { to: '/', label: '首页', icon: Home, emoji: '🏠' },
  { to: '/ingredients', label: '食材', icon: Carrot, emoji: '🥕' },
  { to: '/recipes', label: '菜谱', icon: UtensilsCrossed, emoji: '🍳' },
  { to: '/expiring', label: '临期', icon: AlertTriangle, emoji: '⏰' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-cream-200 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.08)]">
      <div className="max-w-lg mx-auto px-4">
        <ul className="flex items-center justify-around h-20 pb-[env(safe-area-inset-bottom)]">
          {navItems.map(({ to, label, emoji }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center h-full py-2 transition-all duration-300 ${
                    isActive ? 'text-brand-600' : 'text-gray-400 hover:text-brand-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute top-1 w-10 h-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <motion.span
                      className="text-2xl mb-0.5"
                      whileTap={{ scale: 0.9, rotate: -5 }}
                      animate={isActive ? { y: -2, scale: 1.1 } : {}}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {emoji}
                    </motion.span>
                    <span
                      className={`text-xs font-medium transition-all ${
                        isActive ? 'font-bold scale-105' : ''
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
