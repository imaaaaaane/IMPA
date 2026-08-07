import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In the future: handle authentication here
    // For now, simple redirect to dashboard
    if(email && password) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <img src="/impalogo2.jpg" alt="IMPA Logo" className="h-20 w-auto object-contain mb-4" />
        <h2 className="mt-4 text-center text-xl font-medium text-gray-600 dark:text-stone-400">
          Yönetim Paneli
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1A1A1C] py-10 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100 dark:border-stone-800 transition-colors duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-stone-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-stone-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A1A1C] dark:focus:ring-white focus:border-transparent bg-transparent text-gray-900 dark:text-white sm:text-sm transition-colors"
                  placeholder="admin@impa.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-stone-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-stone-700 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A1A1C] dark:focus:ring-white focus:border-transparent bg-transparent text-gray-900 dark:text-white sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white dark:text-[#1A1A1C] bg-[#1A1A1C] dark:bg-white hover:bg-black dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1A1C] dark:focus:ring-offset-[#1A1A1C] transition-colors"
              >
                Giriş Yap
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
