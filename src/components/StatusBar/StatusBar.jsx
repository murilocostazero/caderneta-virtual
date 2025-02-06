import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import './StatusBar.css';

const StatusBar = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, 2000); // 2 segundos

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div className={`status-bar ${type === 'success' ? 'status-success' : 'status-error'}`}>
            {message}
            <MdOutlineClose className='close-sb-icon' onClick={() => setIsVisible(false)} />
        </div>
    );
};

export default StatusBar;