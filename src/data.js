import { FaRegCircleDot } from "react-icons/fa6";
import AwardsAndCertificates from "./components/AwardsAndCertificates";
import Partners from "./components/Partners";
import Careers from "./components/Careers";
import ReadMoreSection from "./components/ReadMore";
import { Link } from "react-router-dom";
import {GoDotFill} from "react-icons/go";
import React from "react";



export const people = [
    {
        name:'Jones Neba',
        gendar:'male',
        position:'Hon President',
        tenure:'2022 - 2026',
        about:[
            'Jones Neba is a Fully licensed clinical officer General with a Bachelor of Science in Clinical Medicine, a Licensed Medical Licentiate Practitioner (MLP). He has served as a Lecturer in various institutions,  a consultant in programme development, a professional examiner with various examination bodies and has served as an external examiner in various universities and colleges. Mr. Neba has experience of over 10 years in leadership, corporate governance and health service delivery. He is currently working as HOD for Clinical Medicine at a University and also providing consultancy works in Higher education. He has taught over 3000 clinical officers in Zambia',
            'He has contributed and guided drafting of various policy documents, from COAZ to health professions. Further, Neba is a trainer of trainers in HIV and AIDS management'
        ],
        qualifications:[
            'Master of Science in Clinical Pathology',
            'Bachelor Science of Human biology',
            'Bachelor of science in Clinical Medicine',
            'Diploma in clincal medicine',
            'Certificate in HIV AIDS',
            'Certificate in Corporate governance',
            'Certificate from Institute of Directors in governance'
        ],
        contributions:[
            "Mr. Neba has been instrumental in the growth of COAZ where he has provided overall leadership for the organization, seeing it grow from Less than 30 members to over 8000 in the space of 2 years. He has been instrumental in guiding organization's overall policy direcion and is charged as the organization's Chairman",
            'Neba previously served as vice president for the association',
            'Neba is a board Member of the Health Professions council of Zambia',
            'He is a member of HPCZ training committee of the board'
        ],
        email:'jones.neba1986@gmail.com',
        image:'/images/neba.jpg'
    },
    {
        name:'Musonda Kamfwa',
        gendar:'male',
        position:'Hon Secretary General',
        tenure:'2022 - 2026',
        about:[
            "Mr. Kamfwa is a Fully Licensed Clinical Officer General with a Diploma In Clinical Medicine.  Hes additionally "+
            "a licensed public health Specialist and scientist. With over 5 years Experience in Health service management, program"+
            " management and consultancy. As a freelance consultant, he's provided consultancy work with various organizations "+
            "from HIV/AIDs programming to planning and implementation of Health systems strengthening programs, policy development"+
            " and analysis to training institution learning programme development",
            "Professionally, Mr. Kamfwa has served as Manager for HIV/TB/cervical cancer, prevention programs in 3 "+
            "provinces in Zambia in various districts, where he led Technical assistance teams and supervised District "+
            "technical teams under care and treatment PEPFAR funded projects. Additionally, he has serviced as a "+
            "Consultant for reputable institutions such as LIAS University,  World Bank, the Ministry of Health, and "+
            "others. outside the association, Mr kamfwa serves on the committee of the HPCZ board - Registrations committee",
            "Mr. Kamfwa has participated in drafting of the following ;",
            "- National Health policy", 
            "- National Health strategic plan for the ministry of health",
            "- health professions bill",
            "- Higher education amendment bill", 
            "- participated in committee review of legislation at parliament", 
            "- drafting of National Health research authority training guidelines",
            "- BSc and Diploma clinical Medicine training standards with Higher education Authority", 
            "- and more"
        ],
        qualifications:[
            'He is a Public Health specialist and clinical officer by profession',
            'Master of Public Health',
            'Master of Public Administration',
            'Bachelor of medical science',
            'Bachelor of science in public health',
            'Diploma in clinical medicine',
            'Postgraduate diploma in project management',
            'Certificate in Project management',
            'Certificate in pediatrics and adult HIV management',
            'Certificate in monitoring and evaluation in Global Health',
            'He is a Ph.D candidate in Public Health (health policy)'
        ],
        contributions:[
            "Mr. Kamfwa has been at the centre of enrolling members into the organization,  moving the organization membership from less than 30 to over 8000",
            'He has been involved in the drafting of the organizations policies and all administrative processes, setting a foundation for the association',
            'Led Drafting of RoadMap for Clinical Officer workforce in the ministry of health',
            'Led drafting of COAZ strategic plan',
            'Led the drafting of COA Training and CPD policy',
            'Founder of the COAZ page'
        ],
        publications:'https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://socialinnovationsjournal.com/index.php/sij/article/download/991/740/3781%23:~:text%3DA%2520clinical%2520officer%2520in%2520Zambia%2520performs%2520general%2520and%2520specialized%2520medical,managing%2520health%2520departments%252C%2520institutions%252C%2520projects&ved=2ahUKEwiZz5vow8eHAxXWwAIHHU5gDOQQFnoECBMQBQ&usg=AOvVaw1hkgd10Mt0Dv2jtF9TTYmm',
        email:'joseph.kamfwa@yahoo.com',
        image:'/images/kamfwa.jpg'
    },
    {
        name:'Jonathan Tapalu',
        gendar:'male',
        position:'Hon National Publicity Secretary',
        tenure:'2022 - 2026',
        about:[
            'Jonathan Tapalu is a Fully licensed clinical officer General with a Bachelor of Science in Clinical Medicine, a Licensed Medical Licentiate Practitioner (MLP). He has been practicing for more than 10years, and has dip. Healthy Public emergency operating systems.  He is currently working attached with the Ministry of Health HQ and overseeing medical emergencies as Chief Emergency Officer',
            'He has contributed in drafting of various policy documents, at the Ministry of Health and COAZ. Further, Mr. Tapalu is a trainer of trainers in BLS/ALS management'
        ],
        qualifications:[
            'Bachelor of science in Clinical Medicine',
            'Diploma in clincal medicine',
            'Certificate in public Health Emergency operations systems',
            'Certificate in HIV AIDS',
            'Certificate in leadership and Management'
        ],
        contributions:[
            'Mr. Tapalu has been instrumental as he was the one that came up with a modified logo of COAZ',
            'Mr. Tapalu previously served as a committee member'
        ],
        email:'jtapalu@gmail.com',
        image:'/images/tapalu.jpg'
    },
    {
        name:'Emmanuel Kashimu',
        gendar:'male',
        position:'Hon Deputy National Publicity',
        tenure:'2022 - 2026',
        about:[
            'Mr. Kashimu Emmanuel is a clinical officer - General, fully Licensed by the health professions Council of Zambia. He is currently working from Sinda District in the Eastern province. He is substantively employed as a Senior Clinical Officer - HIV/TB/STI/Leprosy for Sinda under the ministry of health',
            'Mr. Kashimu Emmanuel has been a member of COAZ for over 5 yrs and is additionally serving as Acting Eastern provincial Chairperson for COAZ Eastern',
            'Mr. Kashimu Emmanuel has served as Health Centre In-charge for 2 different Health Centres and Mini Hospital both Administratively and on Promotional Basis'
        ],
        qualifications:[
            'Diploma in Clinical Medical Sciences',
            'Certificate in Project Management in Global Health',
            'Certificate Clinical Management of HIV in Global Health',
            'Certificate in Leadership and Management in Global Health',
            'Certificate in Monitoring and Evaluation in Global Health'
        ],
        contributions:[
            'He has contributed to the Association by spearheading social media publications under the guidance of the office the national publicity secretary, with support from the secretary General'
        ],
        image:'/images/kashimu.jpg'
    },
    {
        name:'Martha Mwiya',
        gendar:'female',
        position:'Hon National Treasurer',
        tenure:'2022 - 2026',
        about:[
            'Martha is a Licensed Clinical officer General working at Ndola Teaching hospital, the largest teaching hospital on the copperbelt province'
        ],
        qualifications:[
            'Diploma in clinical Medicine',
            'Certificate of competence in financial management'
        ],
        contributions:[
            'Has been a member of the association for over 7 years.',
            'One of the earliest members of the association',
            "She's the National Treasurer for the association"
        ],
        image:'/images/mwiya.jpg'
    },
    {
        name:'Peter Mwanaumbi',
        gendar:'male',
        position:'Hon Deputy Secretary General',
        tenure:'2022 - 2026',
        about:[
            'Mr. Mwanaumbi is a Licensed Clinical officer General working at Ndola Teaching hospital, the largest teaching hospital on the copperbelt province. He is the Deputy Secretary General for the association'
        ],
        qualifications:[
            'Diploma in clinical Medicine'
        ],
        contributions:[
            'Has been a member of the association for over 7 years.',
            'One of the earliest members of the association'
        ]
    }
]

export const findPerson = (position) => {
    return people.find((person) => {return person.position.toLowerCase().includes(position.toLowerCase())})
}

export const association = {
    name:'The Association',
    link:'/association',
    menus:[
        {
          image:'/images/img_26.jpg',
          name:'Delivering Care',
          link:'/association/delivering_care',
          content:'COAZ is dedicated to promoting excellence in professional practice within the healthcare sector. We provide'+ 
                    ' resources, guidelines, and support to empower our member healthcare professionals to deliver high-quality'+ 
                    ' care to their patients. Our focus is enhancing a culture of continuous improvement and innovation in healthcare delivery'
        },
        {
          image:'/images/img_17.jpg',
          name:'Professional Practice',
          link:'/association/professional_practice',
          content:'Patients in Primary Health care facilities deserve care led by Clinical practioners—the most highly educated, '+
                'trained and skilled health care professionals at such levels. Through research, advocacy and education, the COAZ'+
                ' vigorously defends the Clinical practice against scope of practice expansions that threaten patient safety'
    
        },
        {
          image:'/images/img_10.jpg',
          name:'Training Institutions and Students',
          link:'/association/training_institutions_and_students',
          content:'At the state level, the COAZ shapes the policy of influential national policymaking, partners with outside '+
                'experts and stakeholder groups and influences the enactment and/or defeat of state legislation and regulation'
        },
        {
          image:'/images/img_8.jpg',
          name:'Advocacy in Health Care',
          link:'/association/advocacy_in_health_care',
          content:'At the state level, the COAZ shapes the policy of influential national policymaking, partners with outside '+
                'experts and stakeholder groups and influences the enactment and/or defeat of state legislation and regulation'
        },
        {
          image:'/images/img_5.jpg',
          name:'Member Benefits',
          link:'/association/member_benefits',
          content:'Joining the nation’s largest Health professional Organization in Zambia has considerable benefits. In addition '+
                'to opportunities to shape the future of health care, COAZ membership benefits include exclusive access to savings'+
                ' and resources designed to enhance the personal and professional lives of Members'
        }
    ]
}

export const services = {
    name:'Services',
    link:'/services',
    menus:[
        {
            image:'/images/img_49.jpg',
            name:'Learning And CPD',
            link:'/ms'
        },
        {
            image:'/images/img_9.jpg',
            name:'Health Insurance',
            link:'/services/healthinsurance'
        },
        {
            image:'/images/bg_8.jpg',
            name:'Awards and Certificates',
            link:'/services/awards_and_certificates',
            Component: AwardsAndCertificates
        },
        {
            image:'/images/img_28.jpg',
            name:'Resource Banking',
            link:'/services/resource_banking'
        },
        {
            image:'/images/img_6.jpg',
            name:'Research and Journal Publication',
            link:'/services/research_and_journal_publication'
        },
        {
            image:'/images/img_32.jpg',
            name:'Partners',
            link:'/services/partners',
            Component: Partners
        },
        {image:'/images/img_47.jpg',
            name:'Careers',
            link:'/services/careers',
            Component: Careers
        }
    ]
}

export const categories = [
    {
        name:'Clinical Officers',
        professionalCatories:[
            {
                name:'General',
                link:'/categories/general',
                qualification:'Diploma in Clinical Medicine/medical Sciences',
                zambiaQualificationAuthority:'Level 6',
                minimumCreditRequirement:'280 credits or 2800 notional Hours',
                areaOfPractice:'General Practitioner in medicine, maternal and child health, community medicine especially at Primary health care level and secondary health facilities such as Health posts, health centres and first level hospitals such as district hospitals. May practice at general hospital and tertiary if needed',
                limitationsInDrugPrescription:'Non',
                limitationInStatutoryAndLegalDocumentSignatory:'yes, cannot sign certain documents unless under consultation with a medical doctor or as prescribed',
                administration:'yes, allowed legally to supervise Class C facilities such as health posts, health centers and can run these facilities independently',
                scope:''
            },
            {
                name:'Psychiatry',
                link:'/categories/psychiatry',
                qualification:'Diploma in Clinical Medicine - Psychiatry',
                zambiaQualificationAuthority:'Level 6',
                minimumCreditRequirement:'280 credits or 2800 notional Hours',
                areaOfPractice:'General Practitioner in medicine and psychiatry, maternal and child health, community medicine especially at Primary health care level and secondary health facilities such as Health posts, health centres and first level hospitals such as district hospitals. May practice at general hospital and tertiary if needed',
                limitationsInDrugPrescription:'Non, may be limited by procedures',
                limitationInStatutoryAndLegalDocumentSignatory:'Yes, cannot sign certain documents unless under consultation with a medical doctor or as prescribed',
                administration:'Yes, allowed legally to supervise Class C facilities such as health posts, health centers and can run these facilities independently',
                scope:''
            },
            {
                name:'HIV/TB',
                link:'/categories/hiv_tb',
                qualification:'',
                zambiaQualificationAuthority:'',
                minimumCreditRequirement:'',
                areaOfPractice:'',
                limitationsInDrugPrescription:'',
                limitationInStatutoryAndLegalDocumentSignatory:'',
                administration:'',
                scope:''
            },
            {
                name:'Advanced',
                link:'/categories/advanced',
                qualification:'Diploma in Clinical Medicine + Advanced diploma in various areas',
                zambiaQualificationAuthority:'Level 6',
                minimumCreditRequirement:'280 credits or 2800 notional Hours',
                areaOfPractice:'General Practitioner in medicine, maternal and child health, community medicine especially at Primary health care level and secondary health facilities such as Health posts, health centres and first level hospitals such as district hospitals. May practice at general hospital and tertiary if needed',
                limitationsInDrugPrescription:'Non',
                limitationInStatutoryAndLegalDocumentSignatory:'Yes, cannot sign certain documents unless under consultation with a medical doctor or as prescribed',
                administration:'Yes, allowed legally to supervise Class C facilities such as health posts, health centers and can run these facilities independently',
                scope:''
            }
        ]
    },
    {   
        name:'Licentiate',
        professionalCatories:[
            {
                name:'Medical Licentiate Officer/ Practitioner',
                link:'/categories/medical_licentiate_officer_practitioner',
                qualification:'Bachelor of Science in Clinical Medicine',
                zambiaQualificationAuthority:'Level 7',
                minimumCreditRequirement:'480 credits or 4800 notional Hours',
                areaOfPractice:'General Practitioner in medicine, maternal and child health, surgeries including cesarean  sections, community medicine especially at Primary health care level and secondary health facilities such as Health posts, health centres and first level hospitals such as district and general hospitals. May practice at tertiary if needed',
                limitationsInDrugPrescription:'Non',
                limitationInStatutoryAndLegalDocumentSignatory:'Yes, cannot sign certain documents unless under consultation with a medical doctor or as prescribed',
                administration:'Yes, allowed legally to supervise Class C facilities such as health posts, health centers and can run these facilities independently. Supervise clinical officers and others',
                scope:''
            },
            {
                name:'Medical Licentiates',
                link:'/categories/medical_licentiates',
                qualification:'Diploma in Clinical Medicine + Advanced Diploma In CM',
                zambiaQualificationAuthority:'Level 6',
                minimumCreditRequirement:'280 credits or 2800 notional Hours',
                areaOfPractice:'General Practitioner in medicine, maternal and child health, community medicine, perfom surgeries including C/S, especially at Primary health care level and secondary health facilities such as Health posts, health centres and first level hospitals such as district hospitals. May practice at general hospital and tertiary if needed',
                limitationsInDrugPrescription:'Non',
                limitationInStatutoryAndLegalDocumentSignatory:'yes, cannot sign certain documents unless under consultation with a medical doctor or as prescribed',
                administration:'yes, allowed legally to supervise Class C facilities such as health posts, health centers and can run these facilities independently',
                scope:''
            }
        ]
    },
    {
        name:'Others',
        professionalCatories:[
            {
                name:'Clinical Anaesthetic Officers',
                link:'/categories/clinical_anaesthetic_offices',
                qualification:'Bachelor of Science in Clinical Anaesthesia',
                zambiaQualificationAuthority:'Level 7',
                minimumCreditRequirement:'480 credits or 4800 notional Hours',
                areaOfPractice:'General Practitioner in medicine, provide Anesthesia and critical care services at all levels of health care; primary, secondary and tertiary/teaching/specialist hospitals',
                limitationsInDrugPrescription:'Non',
                limitationInStatutoryAndLegalDocumentSignatory:'Yes, cannot sign certain documents  unless under consultation with a medical doctor or as prescribed',
                administration:'Yes, allowed legally to supervise Class C facilities such as health posts, health centers and can run these facilities independently. Supervise juniors and others',
                scope:''
            },
            {
                name:'Mental Health Officers',
                link:'/categories/medical_psychiatry_officers',
                qualification:'Bachelor of Science in Mental Health & Clinical Psychiatry',
                zambiaQualificationAuthority:'Level 7',
                minimumCreditRequirement:'480 credits or 4800 notional Hours',
                areaOfPractice:'General Practitioner in medicine, provide mental health and Psychiatry, rehabilitative service care services in all aspects of mental health, treats complicated clinical psychiatry cases at all levels of health care; primary, secondary and tertiary/teaching/specialist hospitals',
                limitationsInDrugPrescription:'Non',
                limitationInStatutoryAndLegalDocumentSignatory:'Yes, cannot sign certain documents unless under consultation with a medical doctor or as prescribed',
                administration:'Yes, allowed legally to supervise Class C facilities such as health posts, health centers and can run these facilities independently. Supervise juniors and others',
                scope:''
            },
            {
                name:'Clinical Ophthalmic Officers',
                link:'/categories/clinical_ophthalmic_offices',
                qualification:'Bachelor of Science in Clinical Ophthalmology',
                zambiaQualificationAuthority:'Level 7',
                minimumCreditRequirement:'480 credits or 4800 notional Hours',
                areaOfPractice:'General Practitioner in medicine, providing eye services, including cataract surgeries and other eye procedures as per scope at all levels of health care; Primary, secondary and tertiary/teaching/specialist',
                limitationsInDrugPrescription:'Non',
                limitationInStatutoryAndLegalDocumentSignatory:'Yes, cannot sign certain documents such as those going to police reports unless under consultation with a medical doctor or prescribed',
                administration:'Yes, allowed legally to supervise Class C facilities such as health posts, health centers and can run these facilities independently. Allowed to supervise stand alone eye clinics',
                scope:''
            },
            {
                name:'Specialized Clinicians',
                link:'/categories/specialized_cllinicians',
                qualification:'',
                zambiaQualificationAuthority:'',
                minimumCreditRequirement:'',
                areaOfPractice:'',
                limitationsInDrugPrescription:'',
                limitationInStatutoryAndLegalDocumentSignatory:'',
                administration:'',
                scope:''
            }
        ]
    }
]

const getProfessionalCategories = () => {
    let pfCats = [];
    for(let category of categories) {
        for(let pfCat of category.professionalCatories) {
            pfCats.push(pfCat);
        }
    }
    return pfCats;
}

export const professionalCategories = {
    name:'Categories',
    link:'/categories',
    menus:(() => {return getProfessionalCategories()})()
};

export const organisation = {
    name:'Organisation',
    link:'/organisation',
    menus:[

        {
            name:'Governance',
            link:'/organisation/governance',
            menus:[
                {
                    name:'National Executive Committee',
                    link:'/organisation/governance/national_executive_committee',
                    about: [
                        'Executive authority of the Association derives from its members and exercises in a manner that promotes:',
                        <ReadMoreSection>
                            <Link
                                to="/readmore"
                                style={{
                                    display: 'inline-block',
                                    marginTop: '10px',
                                    color: '#007bff',
                                    textDecoration: 'none',
                                }}
                            >
                               Read More
                            </Link>
                        </ReadMoreSection>
                    ],
                    composition:[
                        {
                            name:'',
                            position:'Hon President',
                            image:''
                        },
                        {
                            name:'',
                            position:'Hon Vice President',
                            image:''
                        },
                        {
                            name:'',
                            position:'Hon Secretary General',
                            image:''
                        },
                        {
                            name:'',
                            position:'Hon Deputy Secretary general',
                            image:''
                        },
                        {
                            name:'',
                            position:'Hon National Treasurer',
                            image:''
                        },
                        {
                            name:'',
                            position:'Hon National Publicity',
                            image:''
                        },
                        {
                            name:'',
                            position:'Nominated Members',
                            image:''
                        }
                    ]
                },
                {
                    name:'National Investment Board',
                    link:'/organisation/governance/national_investment_board',
                    about:[
                        'Presides over investments of the association and other related matters'
                    ],
                    composition:[
                        {
                            name:'',
                            position:'The Chairperson',
                            image:''
                        },
                        {
                            name:'',
                            position:'Vice Chairperson',
                            image:''
                        },
                        {
                            name:'',
                            position:'Board Member 1',
                            image:''
                        },
                        {
                            name:'',
                            position:'Board Member 2',
                            image:''
                        },
                        {
                            name:'',
                            position:'Board Member 3',
                            image:''
                        }
                    ]
                },
                {
                    name:'Committees of the Executive',
                    link:'/organisation/governance/committees_of_the_executive',
                    menus:[
                        {
                            name:'The Disciplinary, Ethics, and Professionalism',
                            link:'/organisation/governance/committees_of_the_executive/disciplinary_ethics_and_professionalism',
                            about:[
                                'Its mandate encompasses the development, enforcement, and continuous enhancement of ethical guidelines and codes of conduct within the professional community. Through rigorous investigation, fair adjudication, and education initiatives, strives to maintain an environment where ethical behavior remains of highest standard'
                            ],
                            composition:[
                                {
                                    name:'',
                                    position:'The Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Vice Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 1',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 2',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 3',
                                    image:''
                                }
                            ]
                        },
                        {
                            name:'Training and Education',
                            link:'/organisation/governance/committees_of_the_executive/training_and_education',
                            about:[
                                "Has a strategic focus in cultivating a dynamic and innovative educational system that equips members with the knowledge, skills, and competencies essential for leadership and excellence in clinical practice, research, and advocacy",
                                "Through cutting-edge curriculum development, Continuing professional development (CPD/CME), transformative pedagogical approaches, and strategic partnerships, the committee provides a direction, implementation and advocacy for a lifelong learning and continuous professional growth for the clinical professions"
                            ],
                            composition:[
                                {
                                    name:'',
                                    position:'The Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Vice Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 1',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 2',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 3',
                                    image:''
                                }
                            ]
                        },
                        {
                            name:'Finance and Administration',
                            link:'/organisation/governance/committees_of_the_executive/finance_and_administration',
                            about:[
                                "the steward for the profession's financial sustainability, operational effectiveness, and governance excellence. With a strategic focus on fiscal management, transparency, and accountability",
                                "The committee is mandated in the development of financial management practices, the optimization of administrative processes, and the cultivation of a governance framework that improves organizational resilience"
                            ],
                            composition:[
                                {
                                    name:'',
                                    position:'The Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Vice Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 1',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 2',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 3',
                                    image:''
                                }
                            ]
                        },
                        {
                            name:'Health Services',
                            link:'/organisation/governance/committees_of_the_executive/health_service',
                            about:[
                                "A committee of the executive that is a strategic driver for optimizing healthcare delivery, enhancing quality of care, and promoting equitable access to services",
                                "The committee focuses on identifying systemic barriers and inefficiencies, formulating evidence-based strategies for service improvement, and advocating for policies and initiatives that prioritize patient-centered care, health equity, and population health outcomes",
                                "Through collaboration, innovation, and advocacy, the committee endeavors to shape a healthcare landscape that ensures high-quality, accessible, and equitable care for all individuals and communities"
                            ],
                            composition:[
                                {
                                    name:'',
                                    position:'The Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Vice Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 1',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 2',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 3',
                                    image:''
                                }
                            ]
                        },
                        {
                            name:'Legislation and Judicial',
                            link:'/organisation/governance/committees_of_the_executive/legislation_and_judicial',
                            about:[
                                "The principal advocate and strategist for the profession's policy agenda, legislative priorities, and legal interests. The Committee’s mandate is to anticipate, analyze, and influence policy and legislative developments, champion initiatives that advance the interests and welfare of the profession and to provide expert guidance and representation in legal matters affecting members",
                            ],
                            composition:[
                                {
                                    name:'',
                                    position:'The Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Vice Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 1',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 2',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 3',
                                    image:''
                                }
                            ]
                        },
                        {
                            name:'Public Health and Research',
                            link:'/organisation/governance/committees_of_the_executive/public_health_and_research',
                            about:[
                                "A committee of the executive that is charged with advancing scientific discovery, research excellence, and public health impact. At the intersection of inquiry and action, the committee has a mandate that encompasses the promotion of rigorous scientific inquiry, the dissemination of evidence-based knowledge, and the translation of research findings into policies and practices that promote health equity and societal well-being",
                                "Committed to scientific integrity, innovation, and collaboration. Strives to leverage the collective expertise and influence of the profession to address pressing health challenges and drive meaningful change at local, national, and global levels"
                            ],
                            composition:[
                                {
                                    name:'',
                                    position:'The Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Vice Chairperson',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 1',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 2',
                                    image:''
                                },
                                {
                                    name:'',
                                    position:'Board Member 3',
                                    image:''
                                }
                            ]
                        }
                    ]
                },
                {
                    name:'National Program Coordinators',
                    link:'/organisation/governance/national_program_coordinator',
                },
                {
                    name:'Provincial Executive Committee',
                    link:'/organisation/governance/provincial_executive_committee',
                },
                {
                    name:'District Executive Committees',
                    link:'/organisation/governance/district_executive_committees',
                }
            ]
        },

        {
            name:'Administration',
            link:'/organisation/administration',
            menus:[
                {
                    name:'Employees of the Association',
                    link:'/organisation/administration/employees',
                    employees:[
                        {
                            name:'',
                            position:'Administrative secretary – Legal Services',
                            image:''
                        },
                        {
                            name:'',
                            position:'Administrative assistant – finance and administration',
                            image:''
                        },
                        {
                            name:'',
                            position:'Administrative assistant – front office services',
                            image:''
                        },
                        {
                            name:'',
                            position:'Information Technology officer (ITO)',
                            image:''
                        },
                        {
                            name:'',
                            position:'IT assistant – systems management',
                            image:''
                        },
                        {
                            name:'',
                            position:'Project officer – Hospital and infrastructure services',
                            image:''
                        },
                        {
                            name:'',
                            position:'Drivers',
                            image:''
                        }
                    ]
                },
            ]
        },

        {
            name: 'Laws Of The Association',
            link: '/organisation/laws',
            about: [
                <p key="intro" className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                    The Association will be governed in accordance with the following instruments, in order of precedence:
                </p>,

                <div key="bullets" className="flex flex-col space-y-4 mt-6 w-full">
                    <div className="flex flex-row space-x-4">
                        <GoDotFill size={16} className="text-[rgb(85,85,85)] mt-[5px] shrink-0" />
                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                            This Constitution
                        </p>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <GoDotFill size={16} className="text-[rgb(85,85,85)] mt-[5px] shrink-0" />
                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                            Resolutions of the General Assembly
                        </p>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <GoDotFill size={16} className="text-[rgb(85,85,85)] mt-[5px] shrink-0" />
                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                            By-laws and Regulations
                        </p>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <GoDotFill size={16} className="text-[rgb(85,85,85)] mt-[5px] shrink-0" />
                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                            Membership Code of Conduct
                        </p>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <GoDotFill size={16} className="text-[rgb(85,85,85)] mt-[5px] shrink-0" />
                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                            Professional Code of Conduct
                        </p>
                    </div>

                    <div className="flex flex-row space-x-4">
                        <GoDotFill size={16} className="text-[rgb(85,85,85)] mt-[5px] shrink-0" />
                        <p className="text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]">
                            Other Applicable National Laws
                        </p>
                    </div>
                    <p
                        style={{ fontSize: "25px", lineHeight: "52px" }}
                        className="flex w-[90%] lg:w-[600px] h-auto mt-6 text-left text-[rgb(50,50,50)] font-leBeauneNew"
                    >
                        Constitution
                    </p>
                    <p className="text-[rgb(85,85,85)] text-lg font-jostSemi">
                        Download the official constitution of the Clinical Officers Association of Zambia below.
                    </p>

                    <div className="flex justify-center mt-4">
                        <a
                            href="/Files/COAZ_CONSTITUTION_2025.pdf"
                            download
                            className="px-6 py-3 bg-blue-600 text-white font-jostSemi rounded-lg shadow hover:bg-blue-800 transition"
                        >
                            Download Constitution (PDF)
                        </a>
                    </div>

                </div>

                    ],
        },

    ]
}

export const membership = {
    name:'Membership',
    link:'/membership',
    menus:[
        {
            name:'Full Membership',
            link:'/membership/full_membership',
            EligibilityCriteria:() => 
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>
                        Eligibility Criteria
                    </p>
                    <p className='w-full h-auto text-lg text-[rgb(100,100,100)] font-jostBook'>
                        Full Membership within the Clinical Officers Association of Zambia (COAZ) shall be individuals who meet 
                        the following criteria:
                    </p>
                    <div className='flex flex-row space-x-4'>
                        <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Successful Completion: Prospective Full Members must have successfully completed accredited clinical 
                            officer training programs recognized by relevant regulatory bodies
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <FaRegCircleDot size={16} className='text-[rgb(85,85,85)] mt-[5px] shrink-0'/>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Valid Practicing license: As a prerequisite, individuals seeking Full Membership must hold valid 
                            practicing license issued by the Health Professions council of Zambia
                        </p>
                    </div>
                </div>,
            RightsAndPrivileges:() => (
                <ReadMoreSection title="Rights and Privileges">
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'a)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Participation: Full Members have the right to actively participate in all activities organized by the Association
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'b)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Voting Rights: Full Members shall have the right to cast votes in elections, referendums, and any other matters subjected to a vote by the membership
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'c)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Candidacy for Elective Offices: Full Members are eligible to stand for elective offices within 
                            COAZ, subject to compliance with the relevant provisions outlined in the Constitution
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'d)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Access to Resources: Full Members shall have unrestricted access to educational resources, 
                            publications, and any other deemed beneficial by the Association
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'e)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Benefits Determined by the National Executive Committee: The National Executive Committee 
                            reserves the authority to confer additional benefits and privileges upon Full Members as deemed 
                            appropriate
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'f)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Access to Due Process: Members facing disciplinary actions or disputes with the association 
                            shall be entitled to due process, including the right to be heard, present evidence, and appeal 
                            decisions through established procedures
                        </p>
                    </div>
                </ReadMoreSection>
            ),
            ObligationsAndResponsibilities:() => (
                <ReadMoreSection title="Obligations and Responsibilities">
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'a)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Adherence to Constitution: All Full members of the Clinical Officers Association of Zambia 
                            (COAZ) shall comply with the provisions outlined in this Constitution and any regulations 
                            constituted by the association
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'b)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Knowledge of Constitution: Members are obligated to familiarize themselves with the content of 
                            this Constitution and stay informed about any amendments or updates made by the association
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'c)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Professional Ethics: Members shall uphold the highest standards of professional ethics in the 
                            practice, maintaining the integrity and reputation of the profession, practice, and the 
                            association
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'d)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Compliance with Regulations: Members shall adhere to any ethical guidelines, codes of conduct, 
                            or regulations established
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'e)'}</p>
                        <div className='flex flex-col w-full h-auto space-y-4'>
                            <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                                Financial Responsibilities
                            </p>
                            <div className='flex flex-row space-x-4'>
                                <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'i.'}</p>
                                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                                    Timely Payment: Members are required to pay membership subscriptionfees, or any other 
                                    financial obligations to COAZ promptly, ensuring the continuous financial 
                                    sustainability of the association
                                </p>
                            </div>
                            <div className='flex flex-row space-x-4'>
                                <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'ii.'}</p>
                                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                                    Consequences of Non-Payment: Failure to fulfill financial obligations may result in the 
                                    suspension of membership benefits or other disciplinary actions as stipulated in this 
                                    Constitution
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'e)'}</p>
                        <div className='flex flex-col w-full h-auto space-y-4'>
                            <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                                Financial Transparency
                            </p>
                            <div className='flex flex-row space-x-4'>
                                <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'i.'}</p>
                                <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                                    Access to Financial Reports: Members shall have the right to access summarized 
                                    financial reports, including income, expenditure, and budgetary allocations, subject to 
                                    relevant provisions governing access to information in Zambia
                                </p>
                            </div>
                        </div>
                    </div>
                        </ReadMoreSection>
            ),

        },
        {
            name:'Associate Membership',
            link:'/membership/associate_membership',
            EligibilityCriteria:() =>
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>
                        Eligibility Criteria
                    </p>
                    <p className='w-full h-auto text-lg text-[rgb(100,100,100)] font-jostBook'>
                        Associate Membership is designated for individuals engaged in professions allied to clinical medicine, including 
                        but not limited to medical researchers, healthcare administrators, or educators. The eligibility criteria for 
                        Associate Membership shall be defined in the Association's guidelines
                    </p>
                </div>,
            RightsAndPrivileges:() =>
                <ReadMoreSection title="Rights And Privileges">
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>
                        Rights and Privileges
                    </p>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'a)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Attendance at General Meetings: Associate Members have the right to attend general meetings 
                            convened by the Association
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'b)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Non-voting Participation: While Associate Members may participate in discussions and activities, 
                            they shall not have voting rights in Association matters
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'c)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Access to Designated Resources: Associate Members shall have access to specific resources and 
                            materials as determined by the National Executive Committee
                        </p>
                    </div>
                </div>
                </ReadMoreSection>
        },
        {
            name:'Student Membership',
            link:'/membership/student_membership',
            EligibilityCriteria:() => 
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>
                        Eligibility Criteria
                    </p>
                    <p className='w-full h-auto text-lg text-[rgb(100,100,100)] font-jostBook'>
                        Student Membership is open to individuals actively enrolled in recognized clinical officer/clinical 
                        Sciences/clinical medicine training programs. The eligibility requirements and conditions for 
                        Student Membership shall be explicitly set forth in the Association's regulations
                    </p>
                </div>,
            RightsAndPrivileges:() =>
                <ReadMoreSection title="Rights And Privileges">
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>
                        Rights and Privileges
                    </p>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'a)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Educational Event Participation: Student Members shall be entitled to attend educational events 
                            organized by COAZ to support their academic and professional development
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'b)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Mentorship Opportunities: Student Members may receive mentorship from Full Members of the 
                            Association, fostering their growth within the clinical officer profession
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'c)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Access to Resources: Student Members shall have access to resources aimed at supporting their 
                            academic endeavors and professional aspirations
                        </p>
                    </div>
                </div>
                </ReadMoreSection>
        },
        {
            name:'Life Membership',
            link:'/membership/life_membership',
            EligibilityCriteria:() => 
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>
                        Eligibility Criteria
                    </p>
                    <p className='w-full h-auto text-lg text-[rgb(100,100,100)] font-jostBook'>
                        Life Membership may be conferred upon Full Members in recognition of exceptional contributions to 
                        COAZ or the broader field of clinical medicine. The specific criteria for conferring Life 
                        Membership shall be outlined in the Association's member regulations
                    </p>
                </div>,
            RightsAndPrivileges:() =>
                <ReadMoreSection title="Rights And Privileges">
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>
                        Rights and Privileges
                    </p>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'a)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Lifetime Access: Life Members shall have lifetime access to Association activities, resources, 
                            and benefits, same as full members
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'b)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Exemption fromSubscription Fees: Life Members shall be exempt from any annual subscription fees
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'c)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            All current and former National executive members shall have life membership status
                        </p>
                    </div>
                </div>
                </ReadMoreSection>
        },
        {
            name:'Honorary Membership',
            link:'/membership/honorary-membership',
            EligibilityCriteria:() => 
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>
                        Eligibility Criteria
                    </p>
                    <p className='w-full h-auto text-lg text-[rgb(100,100,100)] font-jostBook'>
                        Honorary Membership may be granted to individuals who have made significant contributions to the 
                        advancement of clinical medicine. The criteria and procedures for conferring Honorary Membership 
                        shall be established by the National Executive Committee
                    </p>
                </div>,
            RightsAndPrivileges:() =>
                <ReadMoreSection title="Rights And Privileges">
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <p className='flex w-full h-auto font-semibold font-leBeauneNew text-[22px] lg:text-4xl text-[rgb(59,59,59)]'>
                        Rights and Privileges
                    </p>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'a)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Special Recognition: Honorary Members shall be accorded special recognition by the association 
                            for their distinguished contributions health or education or similar
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'b)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Attendance at Designated Events: Honorary Members may be invited to attend specific Association 
                            events as determined by the Executive Committee
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'c)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Exemption from Membership Fees: Honorary Members shall be exempt from any membership fees as 
                            prescribed by the Association
                        </p>
                    </div>
                </div>
                </ReadMoreSection>
        },
        {
            name:'Grounds for Termination',
            link:'/membership/grounds_for_termination',
            GroundsForTermination:() => 
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'a)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Non-payment of Dues: Membership may be terminated due to non-payment of membership dues or any 
                            prescribed fees within the stipulated timeframes
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'b)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Violation of Code of Ethics: Termination may result from a member's violation of the COAZ Code 
                            of Ethics or Health professions code of ethics
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'c)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Conduct Prejudicial to the Association: Membership may be terminated if a member engages in 
                            conduct deemed prejudicial to the interests and objectives of the Association
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'d)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Resignation: membership shall be terminated upon resignation
                        </p>
                    </div>
                </div>
        },
        {
            name:'Termination Procedure',
            link:'/membership/termination_procedure',
            TerminationProcedure:() => 
                <div className='flex flex-col space-y-8 w-full h-auto'>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'a)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Notice: Prior to termination, a member shall be provided with written notice specifying the 
                            grounds for termination and affording an opportunity to respond
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'b)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Appeal Mechanism: The member subject to termination shall have the right to appeal against the 
                            decision through established appeal mechanisms outlined in the Association's regulations
                        </p>
                    </div>
                    <div className='flex flex-row space-x-4'>
                        <p className='font-jostBook text-[rgb(85,85,85)] text-lg'>{'c)'}</p>
                        <p className='text-lg tracking-wider font-jostBook text-[rgb(85,85,85)]'>
                            Resignation: Any member may voluntarily resign from COAZ by submitting written notice to the 
                            Secretary General. The resignation shall become effective after 90 days
                        </p>
                    </div>
                </div>
        }
    ]
}

export const menus = [
    {
        name:'Home',
        link:'/home'
    },
    (() => {return association})(),
    (() => {return services})(),
    (() => {return professionalCategories})(),
    (() => {return organisation})(),
    (() => {return membership})(),
    {
        name:'About',
        link:'/about'
    },
    {
        name:'News and Events',
        link:'/news'
    }
];

export const partners = [
    {
        image:'/images/hpcz.png',
        description:'Collaborates in enforcement of regulations, standards of practice and other functions'
    },
    {
        image:'/images/hea.png',
        description:'Collaborates with the higher education Authority in matters of training and other matters related'
    },
    {
        image:'/images/moh.png',
        description:'Providing Health services and enforcing standards in health service delivery'
    },
    {
        image:'/images/local_authority.png',
        description:'Works to strengthen local involvement in Health services and others'
    }
]

export const  news = [
    {
        tag:'Lab coat',
        image:'/images/img3_1.jpg',
        date:'February 11, 2025',
        heading:`Distribution of Lab coat At Matero level one Hospital`,
        content:''
    },

    {
        tag:'Lab coat',
        image:'/images/img1_1.jpg',
        date:'February 12, 2025',
        heading:'Distribution of Lab coat At Chelston Level one Hospital',
        content:'COAZ president with over 45 clinical officers from the sub-District and representative of Troika pharmaceuticals.'
    },

    {
        tag:'Lab coat',
        image:'/images/img2_1.jpg',
        date:'February 15, 2025',
        heading:`Distribution of Lab coat At Kanyama level one Hospital`,
        content:''
    },
   
    {
        tag:'Lab coat',
        image:'/images/img4_1.jpg',
        date:'',
        heading:`Distribution of Lab coat At Kabwe General Hospital`,
        content:''
    },

    {
        tag:'Lab coat',
        image:'/images/img5_2.jpg',
        date:'February 19, 2025',
        heading:`Distribution of Lab coat At Luanshya level one Hospital`,
        content:'The Association Led By Deputy Secretary Mr. peter mwanaumbi Visited Luanshya District Today to support membership on matters of Health Services.'
    },

    {
        tag:'Lab coat',
        image:'/images/img6_2.jpg',
        date:'February 15, 2025',
        heading:`Distribution of Lab coat At Chipata First Level Hospital`,
        content:'COAZ executive and CHIPATA subdistrict members at CHIPATA Level hospital.'
    },
    {
        tag:'AGM',
        image:'/images/img_g3.jpg',
        date:'15 October, 2024',
        heading:'2024 Annual general meeting',
        content:' The Just ended annual general meeting held on 15 October, 2024 In Lusaka, who’s themes: strengthening Clinical care services through training and development and graced by the representative from the Ministry of health, in the company of Coaz president Mr. Jones Neba and Secretary General Mr. Musonda Kamfwa.'
    },
    {
        tag:'AGM',
        image:'/images/img_g8.jpg',
        date:'15 October, 2024',
        heading:'2024 AGM "MOST DEDICATED CLINICIAN AWARD IN LEADERSHIP"',
        content:'Congratulations to the association’s secretary General Mr. Musonda Kamfwa who received this award yesterday at the on-going COAZ Annual Conference. .'
    },
    {
        image:'/images/img_36.jpg',
        date:'April 15, 2024',
        heading:'Professional practice',
        content:'Patients in Primary Health care facilities deserve care led by Clinical practioners—the most highly educated, trained and skilled health care professionals at such levels. Through research, advocacy and education, the COAZ vigorously defends the Clinical practice against scope of practice expansions that threaten patient safety'
    },
    {
        tag:'in other news',
        image:'/images/img_a1.jpg',
        date:'February 7, 2025',
        heading:`Trooika Pharmaceuticals and COAZ`,
        content:'Another successful year has started, and COAZ Executive continues to engage with key partners. We are pleased to have received in assurance from Mr. Ankit, the Managing Director of Trooika Pharmaceuticals, regarding their ongoing support for the association. This includes providing employment opportunities to our members and assisting with our programs whenever needed. As an association, we are both proud and excited about your timely and generous partnership. We look forward to continuing our support for the excellent products listed below. BY COAZ MEDIA.'
        
    },
    {
        tag:'in other news',
        image:'/images/img_a2.jpg',
        date:'February 7, 2025',
        heading:`Trooika Pharmaceuticals and COAZ`,
        content:' '
    },
    {
        tag:'in other news',
        image:'/images/img_b1.jpg',
        date:'February 4, 2025',
        heading:``,
        content:'The COAZ Executive, led by the President, visited the Higher Education Authority (HEA) Director-General professor Kazhila Chinsembu. The purpose of the meeting was to discuss potential collaboration in the accreditation and registration process of higher learning institutions offering Clinical Medicine. This engagement comes in response to the increasing number of training institutions in this field, despite a noticeable decline in the quality of education, particularly in terms of skills, knowledge, and, most concerning, the attitude of graduates.We strongly urge training institutions to adhere to the recommended entry requirements as they enrol students in their programmes. Furthermore, we call on the HEA to take necessary action, including the possible closure of institutions that fail to comply with the established standards. COAZ remains committed to engaging with the HEA to ensure quality assurance in institutions offering Clinical Medicine.Jones Neba President COAZ.'
    },
    {
        tag:'in other news',
        image:'/images/flag.jpg',
        date:'February 4, 2025',
        heading:`COAZ is not surprised`,
        content:'The Clinical Officers Association of Zambia - COAZ) is not surprised by the indirect admission by the Hon. Minister of Health, Dr. E Muchima, regarding the possibility of corruption in the recent recruitment of health workers.The association sympathizes with the minister, the public, and unemployed health workers who may have been disadvantaged by such actions. We have consistently stated that the current composition of the Human Resources Committee involved in recruitment is inadequate and leaves much to be desired. It creates loopholes that could potentially champion corruption, including cronyism.Therefore, we call on the government, through the Ministry of Health and the Civil Service Commission, to disband all Human Resources Management (HRM) committees at the district and provincial levels and reconstitute them.“How can such committees be devoid of the involvement of critical civil society and professional organizations, such as ourselves and other health associations, who are the custodians of healthcare?”The decentralization policy has clearly outlined the roles of associations and civil society organizations, yet it is shocking to see us excluded at the such levels.As long as these committees remain as they are, we can expect cronyism, nepotism, bribery, and other forms of corruption to undermine our nation’s fight against such vices.We are better positioned to advise on recruitment matters, as we are represented in every district and have a deeper understanding of health-related issues. It is only in Zambia where health workers have little to no say in determining health policies.We also urge the Ministry of Health to expedite the drafting of the National Health Policy and the subsequent National Health Services Bill, as these will help address some of these challenges and contribute to the improvement of our nation’s health sector.Musonda Kamfwa, Ph.D(s) MPH MPA Secretary General Chairperson of the Committee on Health Services Clinical Officers Association of Zambia.'
    },
     {
        tag:'agm',
        image:'/images/img_37.jpg',
        date:'April 15, 2024',
        heading:'Advocacy in Health Care',
        content:'At the state level, the COAZ shapes the policy of influential national policymaking, partners with outside experts and stakeholder groups and influences the enactment and/or defeat of state legislation and regulation'
    },
    {
        tag:'agm',
        image:'/images/img_40.jpg',
        date:'April 15, 2024',
        heading:'Member Benefits',
        content:'Joining the nation’s largest Health professional Organization in Zambia has considerable benefits. In addition to opportunities to shape the future of health care, COAZ membership benefits include exclusive access to savings and resources designed to enhance the personal and professional lives of Members'
    }
]
export const  events = [
    {
        image:'/images/img_e1.jpg',
        date:'October 14 to 16, 2025',
        title:'annual general meeting',
        start:'7:00 am',
        end:'10:00 am',
        venue:'City Lusaka'
    },
    {
        image:'/images/img_21.jpg',
        date:'April 18, 2024',
        title:'the vice president will be visiting our headquater offices in lusaka',
        start:'8:00 am',
        end:'10:00 am',
        venue:'Coaz headquaters'
    },
    {
        image:'/images/img_41.jpg',
        date:'April 20, 2024',
        title:"Appointment of the association's president",
        start:'8:00 am',
        end:'10:00 am',
        venue:'Coaz headquaters boardroom'
    },
    {
        image:'/images/img_39.jpg',
        date:'April 22, 2024',
        title:'welcoming of the new president',
        start:'10:00 am',
        end:'1:00 pm',
        venue:'Coaz headquaters main hall'
    }
]

export const sex = [
    'MALE',
    'FEMALE'
]

export const idTypes = [
    "NRC",
    "PASSPORT",
    "DRIVERS_LICENSE"
];







