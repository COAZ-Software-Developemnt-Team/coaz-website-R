import React, { useState } from 'react';

const SimpleDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="p-4 border rounded shadow max-w-sm mx-auto">
            {/* Trigger Button */}
            <button
                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded"
                onClick={toggleDropdown}
            >
                {isOpen ? 'Close Menu' : 'Open Menu'}
            </button>

            {/* Dropdown Content */}
            <div
                className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="p-4 bg-gray-100 mt-2 rounded">
                    <ul className="flex flex-col space-y-2">
                        <li className="p-2 bg-white rounded shadow">Menu Item 1</li>
                        <li className="p-2 bg-white rounded shadow">Menu Item 2</li>
                        <li className="p-2 bg-white rounded shadow">Menu Item 3</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SimpleDropdown;