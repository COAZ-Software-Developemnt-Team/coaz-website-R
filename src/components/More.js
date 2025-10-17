import {Link} from "react-router-dom";

const More = () => {
    return (
        <div className="p-6 space-y-4 mt-6">
            <h2 className="text-2xl font-bold">Full Details</h2>

            <ol className="list-decimal ml-6 space-y-2">
                <li>The values, objectives, and principles enshrined in this Constitution;</li>
                <li>Accountable, ethical, and participatory leadership;</li>
                <li>Efficient and responsive administration of the affairs of the Association.</li>
            </ol>

            <h3 className="text-xl font-semibold mt-6">Responsibilities of the National Executive</h3>
            <ol className="list-decimal ml-6 space-y-2">
                <li>The overall management, coordination, and policy implementation of the Association;</li>
                <li>Representing the Association at national, regional, and international levels;</li>
                <li>Supervising all subordinate organs, committees, and branches;</li>
                <li>Ensuring financial accountability and proper use of Association resources;</li>
                <li>Convening the General Assembly and implementing its resolutions.</li>
            </ol>

            <Link
                to="/readmore"
                className="inline-block px-4 py-2 mt-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
                Back
            </Link>
        </div>
    );
};

export default More;
