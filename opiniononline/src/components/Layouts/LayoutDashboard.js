import { Outlet } from "react-router-dom";
import Nav from "../Nav/Nav"
import { supabase } from "../../supabaseClient";


function Layout() {

   
    const menuItemsDashboard = [
        { name: 'Projecten', link: '/Projecten' },
        { name: 'Account', link: '/Account' },
        { name: 'Tutorial', link: '/Tutorial' },
        { name: 'Over ons', link: '/OverOns' },
    ];

  

    return (
        <div className="">

            <div className="flex ">
                <div className="hidden lg:block w-2/12 border border-t-0 ">
                    <Nav className="" menuItems={menuItemsDashboard}/>
                </div>
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;