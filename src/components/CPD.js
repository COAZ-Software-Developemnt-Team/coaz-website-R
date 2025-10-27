import React from "react";
import ReadMoreSection from "./ReadMore";
import {GoDotFill} from "react-icons/go";

const CPD = () => {
    return (
        <div>
            {/*<Banner*/}
            {/*    title="Learn. Grow. Excel"*/}
            {/*    subtitle="Welcome to your professional learning hub. Every course you take strengthens your skills, advances your career, and improves the health of our communities. Together, we are shaping a stronger, more resilient healthcare system for Zambia."*/}
            {/*    />*/}
            <h2 className="text-xl md:text-xl font-bold">About The Platform</h2>
            <div className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                <p>
                    Our CPD Platform is designed exclusively for Clinical Officers and allied health professionals in Zambia. It provides accessible, accredited, and relevant learning opportunities aligned with the Health Professions Council of Zambia (HPCZ) requirements.
                    Here, members can engage in lifelong learning, earn CPD credits, and contribute to strengthening Zambia’s healthcare delivery.
                </p>
            <ReadMoreSection>
                <h3 className="text-xl md:text-xl font-bold">Accredited CPD Courses</h3>

                <div className="flex flex-col space-y-4 mt-6 w-full">
                    <div className="flex flex-row space-x-4">
                        <GoDotFill
                            size={16}
                            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                        />
                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                            Covering clinical practice, leadership, governance, public health, and specialized fields.
                        </p>
                    </div>
                    <div className="flex flex-col space-y-4 mt-6 w-full">
                        <div className="flex flex-row space-x-4">
                            <GoDotFill
                                size={16}
                                className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                            />
                            <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                Updated regularly in line with HPCZ standards.
                            </p>
                        </div>
                        <h3 className="text-xl md:text-xl font-bold">Flexible Learning</h3>
                        <div className="flex flex-col space-y-4 mt-6 w-full">
                            <div className="flex flex-row space-x-4">
                                <GoDotFill
                                    size={16}
                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                />
                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                    Access courses anytime, anywhere, at your own pace.                                </p>
                            </div>
                            <div className="flex flex-col space-y-4 mt-6 w-full">
                                <div className="flex flex-row space-x-4">
                                    <GoDotFill
                                        size={16}
                                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                    />
                                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                        Options for online, blended, and face-to-face sessions.
                                    </p>
                                </div>
                                <h3 className="text-xl md:text-xl font-bold">Earn And Track CPD Credits</h3>
                                <div className="flex flex-col space-y-4 mt-6 w-full">
                                    <div className="flex flex-row space-x-4">
                                        <GoDotFill
                                            size={16}
                                            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                        />
                                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                            Complete modules and automatically earn CPD points.                             </p>
                                    </div>
                                    <div className="flex flex-col space-y-4 mt-6 w-full">
                                        <div className="flex flex-row space-x-4">
                                            <GoDotFill
                                                size={16}
                                                className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                            />
                                            <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                Download certificates instantly for your records.                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl md:text-xl font-bold">Interactive Learning Spaces</h3>
                                <div className="flex flex-col space-y-4 mt-6 w-full">
                                    <div className="flex flex-row space-x-4">
                                        <GoDotFill
                                            size={16}
                                            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                        />
                                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                            Join peer discussions, case study reviews, and webinars.                                        </p>
                                    </div>
                                    <div className="flex flex-col space-y-4 mt-6 w-full">
                                        <div className="flex flex-row space-x-4">
                                            <GoDotFill
                                                size={16}
                                                className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                            />
                                            <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                Connect with experts and colleagues across Zambia.                                           </p>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl md:text-xl font-bold">Resource Hub</h3>
                                <div className="flex flex-col space-y-4 mt-6 w-full">
                                    <div className="flex flex-row space-x-4">
                                        <GoDotFill
                                            size={16}
                                            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                        />
                                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                            Access the latest national guidelines, policies, and research updates.                                       </p>
                                    </div>
                                    <div className="flex flex-col space-y-4 mt-6 w-full">
                                        <div className="flex flex-row space-x-4">
                                            <GoDotFill
                                                size={16}
                                                className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                            />
                                            <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                Stay informed about innovations in healthcare practice.                                          </p>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl md:text-xl font-bold">Courses Available</h3>
                                <div className="flex flex-col space-y-4 mt-6 w-full">
                                    <div className="flex flex-row space-x-4">
                                        <GoDotFill
                                            size={16}
                                            className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                        />
                                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                           Clinical Medicine Updates                                       </p>
                                    </div>
                                    <div className="flex flex-col space-y-4 mt-6 w-full">
                                        <div className="flex flex-row space-x-4">
                                            <GoDotFill
                                                size={16}
                                                className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                            />
                                            <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                Emergency & Critical Care                                         </p>
                                        </div>
                                        <div className="flex flex-col space-y-4 mt-6 w-full">
                                            <div className="flex flex-row space-x-4">
                                                <GoDotFill
                                                    size={16}
                                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                                />
                                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                    	Mental Health & Psychiatry                                        </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-4 mt-6 w-full">
                                            <div className="flex flex-row space-x-4">
                                                <GoDotFill
                                                    size={16}
                                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                                />
                                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                    Ophthalmology & Eye Health                                          </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-4 mt-6 w-full">
                                            <div className="flex flex-row space-x-4">
                                                <GoDotFill
                                                    size={16}
                                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                                />
                                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                    	Anesthesia & Critical Care                                         </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-4 mt-6 w-full">
                                            <div className="flex flex-row space-x-4">
                                                <GoDotFill
                                                    size={16}
                                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                                />
                                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                    Public Health & Leadership                                         </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-4 mt-6 w-full">
                                            <div className="flex flex-row space-x-4">
                                                <GoDotFill
                                                    size={16}
                                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                                />
                                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                    Non-Communicable Diseases (NCDs) Management                                      </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-4 mt-6 w-full">
                                            <div className="flex flex-row space-x-4">
                                                <GoDotFill
                                                    size={16}
                                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                                />
                                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                    Research & Evidence-Based Practice                                       </p>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-xl md:text-xl font-bold">Benefits For Members</h3>
                                    <div className="flex flex-col space-y-4 mt-6 w-full">
                                        <div className="flex flex-row space-x-4">
                                            <GoDotFill
                                                size={16}
                                                className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                            />
                                            <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                Professional growth and recognition.                                       </p>
                                        </div>
                                        <div className="flex flex-col space-y-4 mt-6 w-full">
                                            <div className="flex flex-row space-x-4">
                                                <GoDotFill
                                                    size={16}
                                                    className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                                />
                                                <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                    Compliance with HPCZ CPD requirements.                                       </p>
                                            </div>
                                            <div className="flex flex-col space-y-4 mt-6 w-full">
                                                <div className="flex flex-row space-x-4">
                                                    <GoDotFill
                                                        size={16}
                                                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                                    />
                                                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                        Opportunities for specialization and advanced training.                                        </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-4 mt-6 w-full">
                                                <div className="flex flex-row space-x-4">
                                                    <GoDotFill
                                                        size={16}
                                                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                                                    />
                                                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                                                        Improved patient care and health outcomes.                                       </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        </div>
                    </div>
                </div>
            </ReadMoreSection>


            </div>
        </div>
    );
};



export default CPD;
