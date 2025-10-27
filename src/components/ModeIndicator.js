import React, {useContext} from "react";
import {UserContext} from "../contexts/UserContext";
import {FaEdit, FaEye} from "react-icons/fa";

const ModeIndicator = () => {
    const { user, mode, setMode } = useContext(UserContext);

    if (!user) return null; // only show if logged in

    const toggleMode = () => {
        setMode(mode === "view" ? "edit" : "view");
    };

    return (
        <div className="fixed top-4 right-4 z-50 cursor-pointer">
      <span
          onClick={toggleMode}
          className={`px-4 py-2 rounded-lg shadow-lg text-white font-semibold transition duration-300 hover:opacity-90 ${
              mode === "view" ? "bg-blue-600" : "bg-green-600"
          }`}
      >
         {mode === "view" ? (
             <>
                 <FaEye /> Viewing Site
             </>
         ) : (
             <>
                 <FaEdit /> Editing (CMS)
             </>
         )}
      </span>
        </div>
    );
};

export default ModeIndicator;
