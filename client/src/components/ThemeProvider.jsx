import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
    const { theme } = useSelector(state => state.theme);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark'); // Apply to <html>
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]); // Re-run when theme changes

    return (
        <div className="bg-white text-gray-700 min-h-screen dark:text-gray-200 dark:bg-[rgb(16,23,42)]">
            {children}
        </div>
    );
};

export default ThemeProvider;
