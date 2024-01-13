import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBell, FaSearch, FaTimes } from 'react-icons/fa';

import SearchBox from './SearchBox';
import DrawerMenu from '../DrawerMenu';
import IconButton from '../IconButton';
import Photo from '../Account/Photo';
import { supabase } from '../../supabaseClient';

import LogoSmall from '../../logoSmall.png';

function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [profilePhotoUpdated, setProfilePhotoUpdated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  let [menuItems, setMenuItems] = useState([]);
  let EditOrDashboard = useRef(null);

  useEffect(() => {
    if (location.pathname.includes('/Editor')) {
      setMenuItems([
        { name: 'Edit', link: '/Editor/Edit' },
        { name: 'Answers', link: '/Editor/Answers' },
        { name: 'Statistics', link: '/Editor/Statistics' },
      ]);

      EditOrDashboard.current = 'Edit';
    } else {
      setMenuItems([
        { name: 'Projecten', link: '/Projecten' },
        { name: 'Account', link: '/Account' },
        { name: 'Tutorial', link: '/Tutorial' },
        { name: 'Over ons', link: '/OverOns' },
      ]);

      EditOrDashboard.current = 'Dashboard';
    }
  }, [location]);

  useEffect(() => {
    const updatePhotoHandler = () => {
      setProfilePhotoUpdated(true);
    };

    window.addEventListener('updatePhoto', updatePhotoHandler);

    return () => {
      window.removeEventListener('updatePhoto', updatePhotoHandler);
    };
  }, []);

  async function LogOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full border-b bg-secondary">
      <div
        className={`${
          EditOrDashboard.current === 'Edit' ? 'w-50' : 'w-2/12'
        } flex items-center justify-center ${showSearch ? 'hidden sm:flex' : ''}`}
      >
        <DrawerMenu menuItems={menuItems} className={'lg:hidden'} />
        <img
          onClick={() => navigate('/')}
          src={LogoSmall}
          alt="logo"
          className="w-20 h-full p-2 cursor-pointer"
        ></img>
      </div>

      <FaSearch
        className={`sm:hidden text-3xl mr-6 text-gray-500 ${
          showSearch ? 'hidden' : ''
        }`}
        onClick={() => setShowSearch(!showSearch)}
      />

      {showSearch && (
        <div className="sm:hidden w-full flex items-center p-2 ">
          <IconButton
            icon={FaTimes}
            className={'m-2 text-2xl'}
            onClick={() => setShowSearch(false)}
          />
          <SearchBox />
        </div>
      )}

      <div className="hidden sm:flex items-center justify-end flex-1 space-x-5 px-5">
        <SearchBox />
        <FaBell className="text-gray-500 text-3xl" />

        <div className="flex items-center space-x-5">
          <div>
            <Photo />
          </div>
          <div className="flex justify-end mt-4">
        <button
          className="border px-4 py-2 rounded-md transition duration-300 ease-in-out 
                    hover:bg-primary hover:text-white focus:outline-none"
          onClick={LogOut}
        >
          Uitloggen
        </button>
      </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
