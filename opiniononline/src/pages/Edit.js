import { Link, useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from "../supabaseClient";
import surveySlice, { fetchLogo, fetchSurveyData, fetchSurveyStyle, updateSectionsList, updateSurveyStyles } from '../slices/surveySlice';


import ProjectStyles from "../components/Editor/ProjectStyles";
import Section from "../components/Editor/Section";
import IconButton from "../components/IconButton";
import ToolBarSide from "../components/Editor/ToolBarSide";

import { FaArrowLeft, FaArrowRight, FaRegEye } from "react-icons/fa";
import ToolBarBottom from "../components/Editor/ToolBarBottom";
import Input from "../components/Editor/Input.js";
import SurveyLogo from "../components/Editor/SurveyLogo.js";
import ProjectStylesDialog from "../components/Editor/ProjectStylesDialog.js";
import ProjectStylesDrawer from "../components/Editor/ProjectStylesDrawer.js";


function Edit() {
    const dispatch = useDispatch();

    const { id } = useParams();
    const sections = useSelector(state => state.surveys.sections);


    const survey = useSelector(state => state.surveys.survey)
    const [updatedSurvey, setUpdatedSurvey] = useState(null);

    const isInitialRender = useRef([true, true]);


    const surveyLogo = useSelector(state => state.surveys.logo);


    const surveyStyle = useSelector(state => state.surveys.surveyStyles)
    const [updatedSurveyStyle, setUpdatedSurveyStyle] = useState();



    useEffect(() => {
        setUpdatedSurveyStyle(surveyStyle)

    }, [surveyStyle])


    useEffect(() => {

        if (isInitialRender.current[0]) {
            isInitialRender.current[0] = false;
            return;
        }

        async function UpdateStyle() {
            const { data, error } = await supabase
                .from('SurveyStyles2')
                .update(updatedSurveyStyle)
                .eq('id', updatedSurveyStyle.id)

            if (error) throw error;

            dispatch(updateSurveyStyles(updatedSurveyStyle));

        }

        if (updatedSurveyStyle) UpdateStyle()

    }, [updatedSurveyStyle])


    useEffect(() => {
        dispatch(fetchSurveyData(id))
        dispatch(fetchSurveyStyle(id))

        console.log(surveyStyle)
    }, [id]);


    useEffect(() => {
        if (survey) {
            setUpdatedSurvey(survey)
            dispatch(fetchLogo(survey?.logo_name))
        }

    }, [survey])


    useEffect(() => {
        if (isInitialRender.current[1]) {
            isInitialRender.current[1] = false;
            return;
        }
        async function UpdateSurvey(survey) {

            try {
                const copyOfSurvey = { ...survey };
                delete copyOfSurvey.Sections2;

                const { error } = await supabase.from('Surveys2').update(copyOfSurvey).eq('id', survey.id).single()

                if (error) throw error;
            }
            catch (error) {
                console.log(error);
            }

        }

        if (survey != null) {
            UpdateSurvey(updatedSurvey)
        }

    }, [updatedSurvey])


    const activeBlock = useSelector(state => state.surveys.active);

    // Stores the active section or question. So if activeBlock changes it stores the div in this ref
    const ref = useRef(null);


    useEffect(() => {

        setTimeout(() => {
            if (ref.current) {
                ref.current.scrollIntoView({ block: "center", behavior: 'smooth' });
            }
        }, 150);

    }, [activeBlock])




    useEffect(() => {
        const subscription = supabase
            .channel(`project ${id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Sections2' }, payload => {

                if (payload.new.surveyId === parseInt(id)) {
                    switch (payload.eventType) {
                        case 'INSERT':

                            // When a new section is added, the list of sections need to get updated
                            dispatch(updateSectionsList(payload.new))

                            break;
                        case 'DELETE':
                            break;
                        case 'UPDATE':
                            break;
                        default:
                            break;
                    }
                }


            })
            .subscribe()


        return () => {
            subscription.unsubscribe();
        }
    }, [])






    return (
        <div className="flex w-full bg-third z-40">

            <ProjectStyles className={'hidden h-[calc(100vh-5rem)] overflow-y-auto sticky top-20 2xl:block w-4/12 p-4 bg-white text-lg'} />

            <div className="w-full min-h-screen border border-t-0">
                <div className="flex justify-end gap-6 p-6 border md:border-none text-3xl">



                    <ProjectStylesDialog className={'md:hidden'} />
                    <ProjectStylesDrawer className={'hidden md:block 2xl:hidden'} />

                    <div className="flex gap-2 text-primary-normal">
                        <IconButton icon={FaArrowLeft} message={"Ongedaan maken"} placement="bottom"></IconButton>
                        <IconButton icon={FaArrowRight} message={"Opnieuw"} placement="bottom"></IconButton>
                    </div>

                    <Link to={`/Preview/${id}`}>
                        <IconButton icon={FaRegEye} message={"Voorbeeld"} placement="bottom" ></IconButton>
                    </Link>

                </div>

                <div className="flex w-full p-2">
                    <div className="flex gap-4 flex-1 justify-center">
                        <div className="text-start w-full md:w-10/12">


                            {
                                surveyLogo ? <SurveyLogo logo={surveyLogo} surveyStyle={surveyStyle} /> : <div className="w-6/12 md:w-4/12 lg:w-2/12 p-3 bg-white border border-primary-normal text-center rounded-lg">
                                <p>Uw logo</p>
        
                            </div>

                            }

                            <div className="mt-10">
                                < Input
                                    value={updatedSurvey?.title}
                                    onChange={(newValue) => setUpdatedSurvey(prev => ({ ...prev, title: newValue }))}
                                    setStyling={true}
                                    className={`
                                        text-${updatedSurveyStyle?.titleFontSize} 
                                        ${updatedSurveyStyle?.titleFontFamily} 
                                        ${updatedSurveyStyle?.titleIsBold ? "font-bold" : "font-normal"}
                                        ${updatedSurveyStyle?.titleIsCursive ? "italic" : "not-italic"}
                                        ${updatedSurveyStyle?.titleIsUnderlined ? "underline" : ""}
                                        `}
                                    onButtonClicks={{
                                        Bold: () => setUpdatedSurveyStyle(prev => ({ ...prev, titleIsBold: !prev?.titleIsBold })),
                                        Cursive: () => setUpdatedSurveyStyle(prev => ({ ...prev, titleIsCursive: !prev.titleIsCursive })),
                                        Underlined: () => setUpdatedSurveyStyle(prev => ({ ...prev, titleIsUnderlined: !prev.titleIsUnderlined }))

                                    }}
                                    buttonStates={{
                                        isBold: surveyStyle?.titleIsBold,
                                        isCursive: surveyStyle?.titleIsCursive,
                                        isUnderlined: surveyStyle?.titleIsUnderlined,
                                    }}
                                />
                            </div>



                            <div className="w-full mb-16">

                                {

                                    sections.map((section) => {

                                        return <Section key={section.id} section={section} ref={ref} />
                                    })
                                }
                            </div>


                        </div>
                        <ToolBarSide className={'hidden lg:block'} />

                    </div>

                </div>

                <ToolBarBottom className={'lg:hidden'} />

            </div>
        </div>
    );
}

export default React.memo(Edit);