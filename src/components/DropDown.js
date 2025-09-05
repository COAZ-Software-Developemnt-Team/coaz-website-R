import React from 'react';
import MenuItem from './MenuItem';

const DropDown = ({ parentDir, show, dropDown, setDropDown, onItemClick }) => {
    if (!show) return null;

    return (
        <div className="absolute top-full left-0 bg-white shadow-md rounded-md z-50">
            {dropDown.menus &&
            dropDown.menus.map((submenu, i) => (
                <MenuItem
                    key={i}
                    id={`${parentDir}-${i}`}
                    name={submenu.name}
                    Icon={submenu.Icon}
                    menus={submenu.menus}
                    dropDownId={submenu.dropDownId}
                    dropDownComponent={submenu.dropDownComponent}
                    onItemClick={onItemClick} // 👈 propagates up
                />
            ))}
        </div>
    );
};

export default DropDown;
