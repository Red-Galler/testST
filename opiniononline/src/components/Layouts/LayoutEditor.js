import { Outlet } from "react-router-dom";
import Nav from "../Nav/Nav";

function LayoutCreate() {
    let menuItems = [
        { name: 'Edit', link: '/Editor' },
        { name: 'Answers', link: '/Editor/Answers' },
        //{ name: 'Statistics', link: '/Editor/Statistics' },
    ]
    return (

        <div className="flex">
            <div className="h-[calc(100vh-5rem)] overflow-y-auto sticky top-20 hidden lg:block w-50 border border-t-0 ">
                <Nav className="" menuItems={menuItems} />
            </div>
            <main className="flex-1 ">
                <Outlet/>
            </main>
        </div>

    );
}

export default LayoutCreate;