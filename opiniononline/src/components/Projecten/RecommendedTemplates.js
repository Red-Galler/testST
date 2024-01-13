import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";

import TemplateCard from "./TemplateCard";
import IconButton from '../IconButton';
import { userContext } from '../../App';


import { FaPlus, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { supabase } from '../../supabaseClient';


function RecommendedTemplates() {
    const [isGridVisible, setIsGridVisible] = useState(true);

    const loggedInUserId = useContext(userContext)


    const navigate = useNavigate();

    async function CreateProject() {
        try {
            const { data, error } = await supabase.rpc('create_survey', {owner_id: loggedInUserId});

            if (error) throw error;

            navigate(`/Editor/${data}`)


        }
        catch (error) {
            console.log(error)
        }
    }

    async function AddSurveyStyle(surveyId) {

        try {

            const { data, error } = await supabase.from('SurveyStyles2').insert({
                surveyId: surveyId
            }).select('id').maybeSingle();


            if (error) throw error

            if (data) return data.id
        }

        catch (error) {
            console.log(error)
        }
    }


    async function AddSection(surveyId) {

        try {

            const { data, error } = await supabase.from('Sections2').insert({
                title: 'Naamloze sectie',
                description: 'Beschrijving',
                sectionOrder: 1,
                surveyId: surveyId
            }).select('id').maybeSingle();


            if (error) throw error

            if (data) return data.id
        }

        catch (error) {
            console.log(error)
        }
    }


    async function AddQuestion(sectionId) {

        try {

            const { data, error } = await supabase.from('Questions2').insert({
                sectionId: sectionId,
                questionContent: "Vraag",
                questionOrder: 1,
                questionKindId: 1
            }).select('id').maybeSingle();


            if (error) throw error

            if (data) return data.id
        }

        catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="bg-secondary m-5 p-5 border">
            <div className="flex justify-between items-center ">
                <h2 className="text-start pb-0 text-2xl font-semibold">Aanbevolen sjablonen</h2>
                {isGridVisible ?
                    <IconButton icon={FaChevronUp} message={'Invouwen'} onClick={() => setIsGridVisible(!isGridVisible)} />
                    :
                    <IconButton icon={FaChevronDown} message={'Uitvouwen'} onClick={() => setIsGridVisible(!isGridVisible)} />
                }
            </div>

            <div className={`flex flex-wrap gap-5 overflow-hidden transition-max-height duration-500 ease-in-out ${isGridVisible ? 'max-h-[200px] mt-6' : 'max-h-0 '}`}>

                <div className="flex justify-center items-center w-7/12 sm:w-4/12 lg:w-3/12 2xl:w-2/12  h-[200px] border bg-gray-light border-gray-dark rounded-xl">

                    <IconButton onClick={() => CreateProject()} icon={FaPlus} message={"Een nieuwe enquête aanmaken"} className={'text-5xl rounded-2xl p-4 group-hover:bg-gray-normal group-hover:text-primary-normal'} />

                </div>

                {Array.from({ length: 5 }, (_, index) => (
                    <TemplateCard key={index} />
                ))}



            </div>

        </div>
    )
}

export default RecommendedTemplates;