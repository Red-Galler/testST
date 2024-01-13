import { useEffect, useRef, useState } from 'react';
import Input from './Input';
import { Checkbox, Option, Radio, Select } from '@material-tailwind/react';
import IconButton from '../IconButton';
import { FaGripHorizontal, FaGripVertical, FaTimes } from 'react-icons/fa';
import { supabase } from '../../supabaseClient';
import { useSelector } from 'react-redux';
import { Reorder, useDragControls } from 'framer-motion';

function AnswerEdit({ answer, questionKind, canDelete, active, questionIsActive }) {
    const [updatedAnswer, setUpdatedAnswer] = useState(answer);

    const sections = useSelector(state => state.surveys.sections);

    const dragControls = useDragControls();


    const isInitialRender = useRef([true, true]);


    async function UpdateAnswer(answer) {

        try {
            const { error } = await supabase.from('Answers2').update(answer).eq('id', answer.id).single()

            if (error) throw error;
        }
        catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {

        if (isInitialRender.current[0]) {
            isInitialRender.current[0] = false;
            return;
          }
          
        UpdateAnswer(updatedAnswer)

    }, [updatedAnswer])



    useEffect(() => {

        if (isInitialRender.current[1]) {
            isInitialRender.current[1] = false;
            return;
          }

        UpdateAnswer(answer);

    }, [answer.orderNr])



    async function DeleteAnswer(answer) {
        if (canDelete) {
            try {

                const { errorDelete } = await supabase.from('Answers2').delete().eq('id', answer.id)

                if (errorDelete) throw errorDelete

                // Runs a stored procedure that is store in Supabase. with rpc we can access the function.
                // The function subtracts 1 from the answerOrderNrs if it is greater then 'deleted_ordernr'
                // If the 'deleted_ordernr' is 1, it subtracts 1 from all the answers
                let { errorUpdate } = await supabase
                    .rpc('subtract_answer_order_nr', {
                        question_id: answer.questionId,
                        deleted_ordernr: answer.orderNr
                    })


                if (errorUpdate) throw errorUpdate

            }
            catch (error) {
                console.log(error)
            }
        }
    }

    return (

        <Reorder.Item value={answer} id={answer.id} dragListener={false} dragControls={dragControls}>

            <div className="sm:flex gap-3 items-center justify-between mt-2 border sm:border-0 group">
                <div className='flex gap-3 items-center sm:w-full'>
                    <div className='flex items-center mb-3'>
                        <FaGripVertical className={`invisible text-gray-dark cursor-pointer ${questionIsActive ? 'group-hover:visible invisible' : ''}`} onPointerDown={(event) => dragControls.start(event)} style={{ touchAction: 'none' }} />
                        {
                            questionKind === 1 && <Radio color="green" disabled /> ||
                            questionKind === 2 && <Checkbox color="green" disabled /> ||
                            questionKind === 3 && <span className='text-2xl'>{answer.orderNr}.</span>  // Display a numbered item, adjust as necessary

                        }
                    </div>
                    < Input value={updatedAnswer.answerContent} onChange={(newValue) => setUpdatedAnswer(prev => ({ ...prev, answerContent: newValue }))} />
                </div>






                <div className={`flex  items-center mt-2   ${active ? 'block' : 'hidden'}`}>
                    <IconButton icon={FaTimes} className={`m-2 text-2xl bg-white`} onClick={() => DeleteAnswer(answer)} />


                    <Select labelProps={{
                        className: 'before:mr-0 after:ml-0 before:pr-0 after:pl-0',
                    }}
                        className={`w-full`}
                        onChange={(newValue) => setUpdatedAnswer(prev => ({ ...prev, nextSectionId: newValue }))}
                        value={answer.nextSectionId}
                    >
                        {
                            sections.map((section) => {
                                return (<Option key={section.id} value={section.id}>{section.title}</Option>)
                            })
                        }
                    </Select>

                </div>


            </div>
        </Reorder.Item >

    )

}


export default AnswerEdit;