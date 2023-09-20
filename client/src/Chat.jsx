import { useContext, useEffect, useState } from 'react';
import Avatar from './Avatar';
import Logo from './components/Logo';
import { UserContext } from './context/userContext';

const Chat = () => {
    const [websocket, setWebsocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [selectedContact, setSelectedContact] = useState(null);

    const { username, id } = useContext(UserContext);

    const showOnlinePeople = peopleArray => {
        const people = {};

        peopleArray.forEach(({ id, username }) => {
            people[id] = username;
        });
        setOnlineUsers(people);
    };

    const handleMessage = event => {
        const messageData = JSON.parse(event.data);

        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        }
    };

    const selectContact = userId => setSelectedContact(userId);

    const onlineUsersExcludingCurrentUser = { ...onlineUsers };
    delete onlineUsersExcludingCurrentUser[id];

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4040');
        setWebsocket(ws);

        ws.addEventListener('message', handleMessage);
    }, []);

    return (
        <div className='flex h-screen'>
            <div className='bg-white w-1/3'>
                <Logo />
                {Object.keys(onlineUsersExcludingCurrentUser).map(id => (
                    <div
                        key={id}
                        className={`border-b border-gray-100 flex items-center gap-2 curstor-pointer hover:bg-gray-200 ${
                            id === selectedContact ? 'bg-gray-300 hover:bg-gray-300' : ''
                        }`}
                        onClick={() => selectContact(id)}
                    >
                        {selectedContact === id && <div className='w-1 h-12 bg-blue-600' />}
                        <div className='py-2 pl-4 flex items-center gap-2'>
                            <Avatar userId={id} username={onlineUsersExcludingCurrentUser[id]} />
                            <span className='text-gray-700'>
                                {onlineUsersExcludingCurrentUser[id]}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-col bg-blue-50 w-2/3 p-2'>
                <div className='flex-grow'>
                    {!selectedContact && (
                        <div className='flex h-full items-center justify-center '>
                            <span className='text-gray-400'>
                                &larr; Select a user to start a conversation
                            </span>
                        </div>
                    )}
                </div>
                <div className='flex gap-2'>
                    <input
                        type='text'
                        className='bg-white flex-grow border p-2 rounded-sm'
                        placeholder='Type your message here...'
                    />
                    <button className='bg-blue-500 p-2 text-white rounded-sm'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-6 h-6'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
