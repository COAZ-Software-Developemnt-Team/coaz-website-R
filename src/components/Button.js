import React from 'react'

const Button = ({text,onClick}) => {
  return (
      <button
          onClick={onClick}
          style={{
            backgroundColor: "#3498db",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
      >
        {text}
      </button>
  );
};

export default Button