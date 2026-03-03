import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Section */}
            <div className="flex-1 flex flex-col">

                {/* Header */}
                <Header />

                {/* Page Content */}
                <div className="flex-1 px-5 py-4 overflow-auto">
                    <Outlet />
                </div>

            </div>
        </div>
    );
};

export default Layout;
