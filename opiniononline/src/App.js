import React, { useEffect, useState, useContext, createContext } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './pages/Login';
import Edit from './pages/Edit';
import Projecten from './pages/Projecten';
import Statistics from './pages/Statistics';
import Account from './pages/Account';
import Answers from './pages/Answers';
import LayoutDashboard from './components/Layouts/LayoutDashboard';
import LayoutEdit from './components/Layouts/LayoutEditor';
import LayoutStatistic from './components/Layouts/LayoutStatistic';
import { supabase } from './supabaseClient';
import Preview from './pages/Preview';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPassword from './pages/ResetPassword';


export const userContext = createContext();


function App() {
  const [session, setSession] = useState(null);
  const[theme, setTheme] = useState("dark");

  useEffect(() => {
    if(theme==="dark"){
      document.documentElement.classList.add("dark");
    }
    else{
      document.documentElement.classList.remove("dark");
    }},[theme])

    const handleThemeSwitch = () => {
      setTheme(theme === "dark" ? "light" : "dark");
    };
    
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {

      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
      <userContext.Provider value={session?.user.id}>
        <BrowserRouter>
          <div className="App h-full">
            {!session ? <Login /> : (
              <div className='h-full'>
                <Header />
                <Routes>
                <Route path="/resetpassword/:token" element={<ResetPassword />} />
                <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
                  <Route path="/" element={<LayoutDashboard />}>
                    <Route index element={<Projecten />} />
                    <Route path='/Projecten' index element={<Projecten />} />
                    <Route path="/Account" element={<Account />} />
                  </Route>
                  <Route path="/Statistics/:id" element={<LayoutStatistic />}>
                    <Route index element={<Statistics />} />
                    <Route path='Overzicht' element={<Statistics />} />
                  </Route>
                  <Route path="/Editor/:id" element={<LayoutEdit />}>
                    <Route index element={<Edit />} />
                    <Route path='Edit' element={<Edit />} />
                    <Route path='Answers' element={<Answers />} />
                  </Route>

                  <Route path='/Preview/:id' element={<Preview />} />


                </Routes>
              </div>
            )}
          </div>
        </BrowserRouter>
      </userContext.Provider>
  );
}

export default App;
