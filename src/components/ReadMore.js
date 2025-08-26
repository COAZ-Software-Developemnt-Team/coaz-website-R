import { useState } from "react";

const ReadMoreSection = ({ title, children }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="flex flex-col space-y-4 w-full h-auto">
            <p className="flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]">
                {title}
            </p>

            {expanded && <div className="space-y-4">{children}</div>}

            <button
                className="mt-2 text-blue-600 hover:underline self-start"
                onClick={() => setExpanded(!expanded)}
            >
                {expanded ? "Show Less" : "Read More"}
            </button>
        </div>
    );
};

export default ReadMoreSection;
