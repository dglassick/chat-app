import { useContext } from 'react';
import RegisterAndLoginForm from './RegisterAndLoginForm';
import { UserContext } from './context/userContext';

const Routes = () => {
    const { username } = useContext(UserContext);

    if (username) {
        return 'logged in ' + username;
    }

    return <RegisterAndLoginForm />;
};

export default Routes;
