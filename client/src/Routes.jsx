import { useContext } from 'react';
import RegisterAndLoginForm from './RegisterAndLoginForm';
import { UserContext } from './context/userContext';
import Chat from './Chat';

const Routes = () => {
    const { username } = useContext(UserContext);

    if (username) {
        return <Chat />;
    }

    return <RegisterAndLoginForm />;
};

export default Routes;
