import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const InputDialog = ({ isOpen, onClose, onConfirm, title, message, placeholder = '', inputType = 'text', defaultValue = '' }) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
        }
    }, [isOpen, defaultValue]);

    const handleSubmit = () => {
        onConfirm(value);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            actions={
                <>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Confirm
                    </button>
                </>
            }
        >
            <div>
                {message && <p className="text-gray-700 mb-3">{message}</p>}
                <input
                    type={inputType}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />
            </div>
        </Modal>
    );
};

export default InputDialog;
