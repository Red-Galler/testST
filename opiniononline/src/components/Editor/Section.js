import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { changeActive } from "../../slices/surveySlice";
import { Reorder } from "framer-motion";


import IconButton from "../IconButton";
import Input from "./Input";
import Question from "./Question";

import { FaArrowsAltV, FaEllipsisH } from "react-icons/fa";
import { Option, Select } from "@material-tailwind/react";


// forwardref allows a component to expose its child element's references to a parent component 'the edit page'
const Section = React.forwardRef(({ section }, ref) => {

    // Makes an observable, so everytime the name, description or orderNr changes we gonna update the database
    const [updatedSection, setUpdatedSection] = useState(section);

    const [questions, setQuestions] = useState([]);

    const sections = useSelector(state => state.surveys.sections)

    const dispatch = useDispatch();

    // Stores the active section or question
    const activeBlock = useSelector(state => state.surveys.active);
    const isActive = activeBlock?.id === section.id && activeBlock?.type === section.type;


    const [questionsExpand, setQuestionsExpand] = useState(true);


    const isInitialRender = useRef([true]);

    // UseEffect for the initial fetch of questions
    useEffect(() => {
  
      async function fetchQuestions(sectionId) {
        try {
          const { data, error } = await supabase
            .from('Questions2')
            .select(`*, QuestionKinds2(kind)`)
            .eq('sectionId', sectionId)
            .order('questionOrder', { ascending: true });
          if (error) {
            throw error;
          }
  
          if (data) {
            const newData = data.map((question) => ({ ...question, type: 'question' }));
            setQuestions(newData);
          }
        } catch (error) {
          console.log(error);
        }
      }
  
      fetchQuestions(section.id);

    }, [section.id]);
  


    useEffect(() => {

        if (isInitialRender.current[0]) {
            isInitialRender.current[0] = false;
            return;
          }

        async function UpdateSection(section) {

            try {
                // when we fetch the data we add a property 'type'
                //When we update the database we get an error because the 'type' column does not exist
                //Therefore, first make a copy and remove the prop

                const copyOfSection = { ...section };
                delete copyOfSection.type;

                const { error } = await supabase.from('Sections2').update(copyOfSection).eq('id', section.id).single()

                if (error) throw error;
            }
            catch (error) {
                console.log(error);
            }

        }


        UpdateSection(updatedSection)

    }, [updatedSection])



    useEffect(() => {
        const subscription = supabase
            .channel(`section ${section.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Questions2' }, payload => {
                switch (payload.eventType) {
                    case 'INSERT':

                        // Only update the array of questions when the incoming insert is from this specific section
                        if (payload.new.sectionId === section.id) {

                            setQuestions(prev => {
                                // We need this type to determine if the active block is a section or a question

                                let updatedQuestions = [...prev, { ...payload.new, type: 'question' }];

                                // questions need to be sorted again if a new question is added
                                updatedQuestions.sort((a, b) => {
                                    if (Number(a.questionOrder) > Number(b.questionOrder)) {
                                        return 1;
                                    } else if (Number(a.questionOrder) < Number(b.questionOrder)) {
                                        return -1;
                                    }
                                    return 0;
                                });


                                // Then we search the new added question, and set it as the active block
                                const newActiveQuestion = updatedQuestions.find(question => question.id === payload.new.id);
                                dispatch(changeActive(newActiveQuestion));

                                setQuestionsExpand(true);

                                return updatedQuestions
                            })

                        }
                        break;
                    case 'DELETE':
                        //setAnswers(prev => prev.filter(answer => answer.id !== payload.old.id));
                        setQuestions(prev => prev.filter(question => question.id !== payload.old.id));

                        break;

                    case 'UPDATE':
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





    function OnClickSection() {
        dispatch(changeActive(section))

        // The questions must be opened every time the section is active
        setQuestionsExpand(true)
    }



    // This function changes the questionOrder prop of the question when a reorder happened
    function ReorderQuestions(newOrder) {
        const updatedQuestions = newOrder.map((question, index) => {
            let copyOfQuestion = { ...question };
            if (index + 1 !== copyOfQuestion.questionOrder) {
                copyOfQuestion.questionOrder = index + 1;
            }
            return copyOfQuestion;
        });

        setQuestions(updatedQuestions);
    }


    return (
        <div ref={isActive ? ref : null} className="w-full mt-16" onClick={OnClickSection}>

            <div className="w-4/12 lg:w-3/12 p-2 bg-primary text-white text-center rounded-t-lg">
                <p>{`Sectie ${updatedSection.sectionOrder} van ${sections.length}`}</p>
            </div>


            <div className="w-full flex bg-white border rounded-lg shadow-lg">
                <div className={`w-2 rounded-s-lg ${isActive ? 'bg-primary' : 'bg-white'} transition-all duration-300 ease-in-out`}></div>

                <div className="p-4 w-full">
                    <div className="relative flex items-start justify-between mb-4">
                        <Input placeholder={"Naam"} value={updatedSection.title} onChange={(newValue) => setUpdatedSection(prev => ({ ...prev, title: newValue }))} />

                        <div className="flex items-center gap-5 text-2xl text-gray-darker">
                            <IconButton icon={FaArrowsAltV} message={"Samenvouwen"} onClick={() => setQuestionsExpand(!questionsExpand)}></IconButton>
                            <IconButton icon={FaEllipsisH} message={"Meer"}></IconButton>
                        </div>
                    </div>

                    <Input placeholder={"Beschrijving"} value={updatedSection.description} onChange={(newValue) => setUpdatedSection(prev => ({ ...prev, description: newValue }))} />
                </div>
            </div>

            <div className={`${!questionsExpand ? 'max-h-0 opacity-0 overflow-hidden' : 'opacity-100'} transition-all ease-in-out delay-75`}>

                <Reorder.Group onReorder={ReorderQuestions} axis="y" values={questions}>
                    {
                        questions.map((question) => {

                            return (<Question key={question.id} ref={activeBlock?.id === question.id && activeBlock?.type === question.type ? ref : null} question={question} />)

                        })
                    }
                </Reorder.Group>
            </div>


            {
                updatedSection.sectionOrder !== sections.length &&

                <div className="flex items-center gap-3 mt-5">
                    <span className="flex">{`Na Sectie ${updatedSection.title}`}</span>
                    <div className="">

                        <Select labelProps={{
                            className: 'before:mr-0 after:ml-0 before:pr-0 after:pl-0',
                        }}
                            className={`w-full`}
                            onChange={(newValue) => setUpdatedSection(prev => ({ ...prev, nextSectionId: newValue }))}
                            value={updatedSection.nextSectionId ?? 0}
                        >

                            <Option key={0} value={0}>{'Naar de volgende sectie'}</Option>
                            {
                                sections.map((section) => {
                                    return (<Option key={section.id} value={section.id}>{section.title}</Option>)
                                })

                            }





                        </Select>


                    </div>
                </div>

            }

        </div>
    )
})


export default Section;