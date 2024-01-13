import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login'; // Importeer je CSS-bestand
import logo from '../Logo.png'; // Pas het pad aan op basis van de locatie van je logo-afbeelding
import { supabase } from '../supabaseClient';
import ForgotPassword from './ForgotPassword';
import { Input, Button } from "@material-tailwind/react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (user) {
        // Pass the user data to the "Account.js" page, including UID
        navigate('/account', { state: { user } });
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  const handleForgotPasswordClick = () => {
    navigate('/ForgotPasswordPage');
  };

  return (
    <div className="flex w-full h-screen lg:p-10 bg-white dark:bg-dark-default dark:text-white">
      <div className='block lg:flex w-full shadow-3xl'>
        <div className='hidden lg:flex items-center justify-center w-6/12 bg-green-light dark:bg-dark-green-light shadow-xl border border-gray-500'>
          <img src={logo} alt='logo OpineOnline'></img>
        </div>

        <div className='flex justify-center w-full lg:w-6/12 items-center text-left'>
          <div className='sm:w-8/12 md:w-8/12 m-3' >
            <img src={logo} alt='logo OpineOnline' className='lg:hidden'></img>

            <h1 className='text-4xl'>Welkom terug</h1>

            <p className='mt-2 mb-10 text-gray-darker font-bold'>Welkom terug! Vul alstublieft uw gegevens in.</p>

            <form className='text-start' onSubmit={handleSubmit}>
              <div>
                <label className='text-xl'>Email</label>
                <Input
                  size="lg"
                  placeholder="Voer uw email in"
                  className=" !border-t-blue-gray-200 focus:!border-green-300 mt-1 text-xl !py-6 dark:border-dark-border"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  onChange={handleEmailChange}
                  required
                />
              </div>

              <div className='mt-10'>
                <label className='text-xl'>Paswoord</label>
                <Input
                  size="lg"
                  type='password'
                  className=" !border-t-blue-gray-200 focus:!border-green-300 mt-1 text-xl !py-6 dark:border-dark-border"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  onChange={handlePasswordChange}
                  required
                  autoComplete=''
                />
              </div>

              <p className='text-end mt-5 text-green-500 font-semibold'>
                <button onClick={handleForgotPasswordClick} className="cursor-pointer text-green-500 focus:outline-none">
                  Paswoord vergeten?
                </button>
              </p>


              <Button type='submit' size='lg' className='w-full mt-8 bg-primary dark:bg-dark-green-normal'>Log in</Button>

              {/* ... (andere buttons) */}

              <p className='text-center mt-4 font-semibold'>
                <a className='' href='#d'>Hebt u nog geen account? <span className='text-green-500'>Registreer gratis</span></a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
