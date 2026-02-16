import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-all duration-300 group"
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Sun className="text-yellow-500 group-hover:rotate-45 transition-transform duration-500" size={20} />
            ) : (
                <Moon className="text-slate-700 group-hover:-rotate-12 transition-transform duration-500" size={20} />
            )}
        </button>
    );
}
