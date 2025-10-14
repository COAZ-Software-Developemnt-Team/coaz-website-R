import React from 'react'
import { GoDotFill } from "react-icons/go";
import ReadMoreSection from "./ReadMore";

const AdvocacyInHealth = () => {

  return (
        <div>
          <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
            COAZ is committed to advancing health insurance policies in Zambia, ensuring that Clinical Officers and the communities they serve are not left behind.
            <p>
              Our advocacy focuses on four key areas:
            </p>
            <ReadMoreSection>
              <h3 className="text-xl md:text-xl font-bold">National Health Insurance Coverage</h3>
              <div className="flex flex-col space-y-4 mt-6 w-full">
                <div className="flex flex-row space-x-4">
                  <GoDotFill
                      size={16}
                      className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                  />
                  <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                    Engaging the government to expand NHIMA benefits to reflect the needs of frontline health workers and rural populations.
                    <a
                        href="https://www.nhima.co.zm/membership/benefits-packages"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                    >
                      Click Here
                    </a>
                  </p>
                </div>
                <div className="flex flex-col space-y-4 mt-6 w-full">
                  <div className="flex flex-row space-x-4">
                    <GoDotFill
                        size={16}
                        className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                    />
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                      	Advocating for inclusive coverage for underrepresented health facilities.                                     </p>
                  </div>
                  <h3 className="text-xl md:text-xl font-bold">Improved Service Access</h3>

                  <div className="flex flex-col space-y-4 mt-6 w-full">
                    <div className="flex flex-row space-x-4">
                      <GoDotFill
                          size={16}
                          className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                      />
                      <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        Expanding accreditation of rural and peri-urban facilities so that members in remote areas can access quality services without traveling long distances.                                     </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4 mt-6 w-full">
                    <div className="flex flex-row space-x-4">
                      <GoDotFill
                          size={16}
                          className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                      />
                      <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        Supporting integration of telemedicine and mobile health solutions.                                     </p>
                    </div>
                  </div>
                  <h3 className="text-xl md:text-xl font-bold">Transparent Claims & Accountability</h3>

                  <div className="flex flex-col space-y-4 mt-6 w-full">
                    <div className="flex flex-row space-x-4">
                      <GoDotFill
                          size={16}
                          className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                      />
                      <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        Working with policymakers to simplify claims processing, reduce delays, and increase trust in insurance management systems.                                     </p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4 mt-6 w-full">
                    <div className="flex flex-row space-x-4">
                      <GoDotFill
                          size={16}
                          className="text-[rgb(85,85,85)] mt-[5px] shrink-0"
                      />
                      <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                        Encouraging regular reporting and transparency from insurers and NHIMA.                                     </p>
                    </div>
                    <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                      Through these advocacy efforts, COAZ continues to represent the voice of Clinical Officers, shaping a fairer and more accessible health insurance system for all Zambians.
                    </p>
                    <h3 className="text-xl md:text-xl font-bold">COAZ Group Health Insurance Scheme </h3>
                    <a
                        href="/association/member_benefits"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-600"
                    >
                      Click Here
                    </a>
                  </div>
                </div>
              </div>
            </ReadMoreSection>
          </p>
        </div>
    )
  }

  export default AdvocacyInHealth