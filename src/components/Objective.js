import React from "react";
import {Link} from "react-router-dom";
import {GoDotFill} from "react-icons/go";

const Objective = () => {
    return (
        <div className="flex flex-col w-full min-h-screen px-[10%] py-12 bg-white">
            {/* Heading */}
            <p
                style={{fontSize: "42px", lineHeight: "52px"}}
                className="flex w-full h-auto mt-8 text-[rgb(50,50,50)] font-leBeauneNew"
            >
                Objectives of the Association
            </p>

            {/* Intro text */}
            <p className="text-[rgb(85,85,85)] text-lg font-jostSemi mt-6 w-full">
                The objectives of the Association will include, but are not limited to,
                the following:
            </p>

            {/* Bullet objectives */}
            <div className="flex flex-col space-y-4 mt-6 w-full">
                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To advocate for the professional recognition, protection, and
                        progression of clinical officers and mid-level clinical
                        practitioners.
                    </p>
                </div>

                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To promote high standards of ethics, clinical practice, and
                        continuing professional development.
                    </p>
                </div>

                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To engage with government, regulatory bodies, institutions, and
                        partners on matters affecting healthcare and Clinical Officer
                        practice.
                    </p>
                </div>

                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To safeguard the welfare, rights, and working conditions of members.
                    </p>
                </div>
                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To contribute to the formulation, implementation, and review of
                        health and education policies, and systems at national and
                        sub-national levels.
                    </p>
                </div>
                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To strengthen the unity, discipline, and professional identity of
                        members.
                    </p>
                </div>
                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To support academic and training institutions in shaping curricula
                        and clinical training for clinical officers and mid-level clinical
                        practitioners.
                    </p>
                </div>
                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To promote partnerships, both local and international, aimed at
                        strengthening the role and contribution of Clinical Officers in
                        healthcare delivery.
                    </p>
                </div>
                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To publish and disseminate research findings, policy briefs, and
                        working papers to influence policy and the society
                    </p>
                </div>
                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        Provide advocacy in matters of health
                    </p>
                </div>
                <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        To perform other functions incidental to the attainment of these
                        objectives
                    </p>
                </div>
            </div>

            {/* Centered Back Link */}
            <div className="flex justify-center mt-8">
                <Link
                    to="/about"
                    className="text-blue-600 font-jostSemi underline hover:text-blue-800 transition"
                >
                    Back to About
                </Link>
            </div>
        </div>
    );
};

export default Objective;
