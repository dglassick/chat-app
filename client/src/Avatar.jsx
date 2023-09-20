import PropTypes from 'prop-types';

const Avatar = ({ userId, username }) => {
    const colors = [
        'bg-red-200',
        'bg-green-200',
        'bg-purple-200',
        'bg-blue-200',
        'bg-yellow-200',
        'bg-teal-200',
    ];

    const userIdBase10 = parseInt(userId, 16);
    console.log(userIdBase10);
    console.log(userIdBase10 % colors.length);
    const colorindex = userIdBase10 % colors.length;
    const color = colors[colorindex];

    return (
        <div className={`w-8 h-8 bg-red-200 rounded-full flex items-center l- ${color}`}>
            <div className='text-center w-full opacity-70'>{username[0].toUpperCase()}</div>
        </div>
    );
};

Avatar.propTypes = {
    userId: PropTypes.string,
    username: PropTypes.string,
};

export default Avatar;
