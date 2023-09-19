import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        axios.get('/profile', {}).then(res => {
            console.log(res.data);
            setId(res.data.id);
            setUsername(res.data.username);
        });
    }, []);
    return (
        <UserContext.Provider value={{ username, setUsername, id, setId }}>
            {children}
        </UserContext.Provider>
    );
};

UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
