import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";

import { useDispatch, useSelector } from "react-redux";
import { changeActive } from "../../slices/surveySlice";
import { Reorder, useDragControls } from "framer-motion";


import { Select, Option, Switch } from "@material-tailwind/react";
import { FaGripHorizontal } from "react-icons/fa";

import Input from './Input';
import IconButton from "../IconButton";
import AnswerEdit from "./AnswerEdit";
import AddAnswers from "./AddAnswer";
import DeleteQuestion from "./DeleteQuestion";
import CopyQuestion from "./CopyQuestion";




// forwardref allows a component to expose its child element's references to a parent component 'section'
const Question = React.forwardRef(({ question }, ref) => {

    const [updatedQuestion, setUpdatedQuestion] = useState(question);

    const [answers, setAnswers] = useState([]);

    const allQuestionKinds = useSelector(state => state.surveys.allQuestionKinds);

    const dispatch = useDispatch();

    // Stores the active section or question
    const activeBlock = useSelector(state => state.surveys.active);

    const isActive = activeBlock?.id === question.id && activeBlock?.type === question.type;

    const dragControls = useDragControls();


    const surveyStyle = useSelector(state => state.surveys.surveyStyles)



    async function UpdateQuestion(question) {

        try {
            // Deletes added props before updating the row
            const copyOfQuestion = { ...question };

            delete copyOfQuestion.type;
            delete copyOfQuestion.QuestionKinds2

            const { error } = await supabase.from('Questions2').update(copyOfQuestion).eq('id', question.id).single()

            if (error) throw error;
        }
        catch (error) {
            console.log(error);
        }

    }



    const isInitialRender = useRef([true, true]);

    // when orderNr changes
    useEffect(() => {

        if (isInitialRender.current[0]) {
            isInitialRender.current[0] = false;
            return;
        }

        UpdateQuestion(question);

    }, [question.questionOrder])





    // When questionContent or kindId changes
    useEffect(() => {

        if (isInitialRender.current[1]) {
            isInitialRender.current[1] = false;
            return;
        }

        UpdateQuestion(updatedQuestion)

    }, [updatedQuestion])





    useEffect(() => {

        async function fetchAnswers(question) {
            try {
                const { data, error } = await supabase.from('Answers2').select('*').eq('questionId', question.id).order('orderNr', { ascending: true })

                if (error) {
                    throw error
                }

                if (data) {
                    setAnswers(data);
                }
            }
            catch (error) {
                console.log(error)
            }
        }


        fetchAnswers(question);


        const subscription = supabase
            .channel(question.id)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Answers2' }, payload => {
                switch (payload.eventType) {
                    case 'INSERT':
                        if (payload.new.questionId === question.id) {
                            setAnswers(prev => [...prev, payload.new]);
                        }

                        break;
                    case 'DELETE':
                        setAnswers(prev => prev.filter(answer => answer.id !== payload.old.id));
                        break;
                    case 'UPDATE':
                        if (payload.new.questionId === question.id) {
                            fetchAnswers(question);
                        }
                        break;
                    default:
                        break;
                }
            })
            .subscribe()


        return () => {
            subscription.unsubscribe();
        }
    }, [])




    function OnClickQuestion(e) {
        e.stopPropagation();
        dispatch(changeActive(question))
    }



    function ReorderAnswers(newOrder) {
        const updatedAnswers = newOrder.map((answer, index) => {
            let copyOfAnswer = { ...answer };
            if (index + 1 !== copyOfAnswer.questionOrder) {
                copyOfAnswer.orderNr = index + 1;
            }
            return copyOfAnswer;
        });

        setAnswers(updatedAnswers);
    }


    return (
        <Reorder.Item value={question} id={question.id} dragListener={false} dragControls={dragControls}
        >
            <div ref={ref} onClick={OnClickQuestion} className="w-full bg-white border rounded-lg flex mt-10">
                <div className={`w-2 rounded-s-lg ${isActive ? 'bg-primary' : 'bg-white'} transition-all duration-300 ease-in-out`}>

                </div>
                <div className="flex-1 p-4">
                    <div className={`${isActive ? 'flex' : 'hidden'} flex justify-center cursor-pointer`} >
                        <FaGripHorizontal className="text-gray-dark" onPointerDown={(event) => dragControls.start(event)} style={{ touchAction: 'none' }} />
                    </div>
                    <div className={`relative sm:flex items-start gap-7`}>
                        <div className="flex-1">
                            <Input
                                placeholder={'Uw vraag'}
                                value={updatedQuestion.questionContent}
                                onChange={(newValue) => setUpdatedQuestion(prev => ({ ...prev, questionContent: newValue }))}
                                setStyling={true}
                                className={`${surveyStyle.questionFontFamily} text-${surveyStyle.questionFontSize} ${updatedQuestion.isBold ? "font-bold" : "font-normal"}  ${updatedQuestion.isCursive ? "italic" : "not-italic"} ${updatedQuestion.isUnderlined ? "underline" : "no-underline"}`}
                                onButtonClicks={{
                                    Bold: () => setUpdatedQuestion(prev => ({ ...prev, isBold: !updatedQuestion.isBold })),
                                    Cursive: () => setUpdatedQuestion(prev => ({ ...prev, isCursive: !updatedQuestion.isCursive })),
                                    Underlined: () => setUpdatedQuestion(prev => ({ ...prev, isUnderlined: !updatedQuestion.isUnderlined }))
                                }}
                                buttonStates={{
                                    isBold: updatedQuestion.isBold,
                                    isCursive: updatedQuestion.isCursive,
                                    isUnderlined: updatedQuestion.isUnderlined
                                }}
                            />
                        </div>

                        <div className={`${isActive ? 'block' : 'hidden'}`}>

                            <Select
                                size="lg"
                                value={question.questionKindId}
                                onChange={(newValue) => setUpdatedQuestion(prev => ({ ...prev, questionKindId: newValue }))}
                                labelProps={{
                                    className: 'before:mr-0 after:ml-0 before:pr-0 after:pl-0',
                                }}
                            >
                                {
                                    allQuestionKinds.map((kind) => {
                                        return (<Option key={kind.id} value={kind.id}>{kind.kind}</Option>)
                                    })
                                }

                            </Select>
                        </div>

                    </div>
                    <div className="flex flex-col mt-3">

                        <Reorder.Group onReorder={ReorderAnswers} axis="y" values={answers}>

                            {answers.map((answer) => {
                                return (
                                    <AnswerEdit key={answer.id} answer={answer} questionKind={updatedQuestion.questionKindId} canDelete={answers.length > 1} active={isActive} questionIsActive={isActive} />
                                )
                            })}
                        </Reorder.Group>




                        {isActive ?
                            <div>
                                <AddAnswers question={updatedQuestion} answersCount={answers.length} />

                                <div>
                                    <hr className="mt-16" />
                                    <div className="flex justify-end p-4 gap-4">

                                        <div>
                                            <DeleteQuestion question={question} />
                                            <CopyQuestion question={question} />
                                        </div>


                                        <Switch label={'Verplicht'}
                                            color="green"
                                            labelProps={{
                                                className: "text-xl",
                                            }}
                                            checked={updatedQuestion.answerRequired}
                                            onChange={() => setUpdatedQuestion(prev => ({ ...prev, answerRequired: !updatedQuestion.answerRequired }))}
                                        />

                                    </div>
                                </div>
                            </div>
                            : null
                        }




                    </div>
                </div>
            </div>
        </Reorder.Item>

    );
})

export default Question

