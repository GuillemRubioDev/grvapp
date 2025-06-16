import { Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import SpinnerGrv from '../feedback/SpinnerGrv';
import PrivateNavbar from './PrivateNavbar';


const NAVBAR_HEIGHT = 56;

const PrivateLayout = () => {
    const { loading } = useUser();

    return (
        <div className="flex flex-col min-h-screen">
            <PrivateNavbar />
            <main
                className="flex-1 p-6 bg-background dark:bg-dark-background"
                style={{ marginTop: NAVBAR_HEIGHT }}
            >
                <Outlet />
            </main>
            {loading && <SpinnerGrv />}
        </div>
    );
};

export default PrivateLayout;