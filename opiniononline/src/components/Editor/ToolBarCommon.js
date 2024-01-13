import { FaFileImport, FaPause, FaPlus } from "react-icons/fa";
import IconButton from "../IconButton";
import { useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";

function ToolBarCommon({className}) {
    const [isSaving, setIsSaving] = useState(false); // Add state to track saving status


    // Stores the active section or question
    const activeBlock = useSelector(state => state.surveys.active);

    const sections = useSelector(state => state.surveys.sections);
    const survey = useSelector(state => state.surveys.survey?.id);

    

    async function AddQuestion() {

        if (isSaving) {
            return
        }

        setIsSaving(true);

        try {

            let question = {
                questionKindId: 1, // Default multiplechoice question
                questionContent: ``,
                sectionId: 0,
                questionOrder: 0
            }

            if (activeBlock?.type === 'question') {
                question.questionContent = `Vraag`;
                question.sectionId = activeBlock.sectionId;
                question.questionOrder = activeBlock.questionOrder + 1;
            }
            else if (activeBlock?.type === 'section') {
                question.questionContent = `Vraag`;
                question.sectionId = activeBlock.id;
                question.questionOrder = 1;
            }
            else {
                question.questionContent = `Vraag`;
                question.sectionId = sections[0].id;
                question.questionOrder = 1;

            }

            let { errorUpdate } = await supabase
                .rpc('test', {
                    p_sectionid: question.sectionId,
                    p_desiredorder: question.questionOrder
                })


            if (errorUpdate) throw errorUpdate

            setIsSaving(false);
        }
        catch (error) {
            setIsSaving(false);

            console.log(error);
        }


    }

    async function AddSection() {
        if (isSaving) {
            return
        }

        setIsSaving(true);

        try {
            
            let { insertError } = await supabase
                .rpc('add_section', {
                    section_order: sections.length + 1,
                    survey_id: survey
                })

            if (insertError) throw insertError

            
            setIsSaving(false);

        }
        catch (error) {
            setIsSaving(false);

            console.log(error)
        }
    }

    return (
        <div className={className}>
            <IconButton icon={FaPlus} onClick={AddQuestion} className={'p-5 text-3xl'} />
            <IconButton icon={FaPause} onClick={AddSection} className={'p-5 rotate-90 text-3xl'} />
            <IconButton icon={FaFileImport} className={'p-5 text-3xl'} />
        </div>
    );
}



export default ToolBarCommon;