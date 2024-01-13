import { Button, Checkbox, Radio, useSelect } from "@material-tailwind/react";
import IconButton from "../components/IconButton";
import { FaPen } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CheckboxGroup from "../components/Preview/CheckboxGroup";
import RadioButtonGroup from "../components/Preview/RadioButtonGroup";
import SurveyLogo from "../components/Editor/SurveyLogo"
import { useDispatch, useSelector } from "react-redux";
import { fetchLogo, fetchSurveyStyle, updateLogo } from "../slices/surveySlice";

function Preview() {
    const { id } = useParams();

    const dispatch = useDispatch();
    const [survey, setSurvey] = useState(null);


    const surveyLogo = useSelector(state => state.surveys.logo);
    const surveyStyle = useSelector(state => state.surveys.surveyStyles)



    const [activeQuestion, setActiveQuestion] = useState(null);
    const [activeSection, setActiveSection] = useState(null);

    const [selectedAnswers, setSelectedAnswers] = useState({});

    const [disablePrevious, setDisablePrevious] = useState(true);
    const [disableNext, setDisableNext] = useState(true);


    const [endOfSurvey, setEndOfSurvey] = useState(false);

    const [path, setPath] = useState([]);

    useEffect(() => {
        async function GetSurvey() {

            try {
                const { data, error } = await supabase.from('Surveys2').select('id, title, logo_name , Sections2(id, sectionOrder, nextSectionId, Questions2(*, Answers2(*)))').eq('id', id).single();

                if (error) throw error;


                if (data) {

                    setSurvey(data)



                    dispatch(fetchLogo(data.logo_name))


                    dispatch(fetchSurveyStyle(data.id))

                    let firstSection = data.Sections2.find(section => section.sectionOrder === 1)

                    setActiveQuestion(FindFirstQuestion(firstSection))
                }
            }
            catch (error) {
                console.log(error)
            }

        }

        GetSurvey();
    }, [])





    useEffect(() => {


        if (activeQuestion != null) {

            const section = FindSectionById(activeQuestion.sectionId)

            setActiveSection(section)


            // When the we are back at the first question, we want to disable the backbutton and set an empty path
            if (activeQuestion?.questionOrder === 1 && section?.sectionOrder === 1) {
                setDisablePrevious(true)
                setPath([])
            }

        }


    }, [activeQuestion])



    useEffect(() => {
        if (endOfSurvey) {
            SubmitAnswers();

        }
    }, [endOfSurvey])


    useEffect(() => {

        let test = selectedAnswers[activeQuestion?.id]

        if (activeQuestion?.answerRequired) {

            if (Array.isArray(test) && test.length > 0) {
                setDisableNext(false);
            }
            else {
                setDisableNext(true)
            }
        }

        else {
            setDisableNext(false)
        }

    }, [selectedAnswers])


    function NextQuestion() {

        setDisablePrevious(false)
        setPath(prev => [...prev, activeQuestion?.id])


        let nextSection = null;
        let nextQuestion = null;



        // When we have a question with radiobuttons it is possible that a radiobutton redirects to another section.

        if (activeQuestion.questionKindId === 1 && selectedAnswers[activeQuestion.id][0]?.nextSectionId != null) {

            nextSection = FindSectionById(selectedAnswers[activeQuestion.id][0].nextSectionId)
            nextQuestion = FindFirstQuestion(nextSection);
        }


        else {

            nextQuestion = activeSection.Questions2.find(question => question.questionOrder === activeQuestion.questionOrder + 1)


            // If there is no question left in the current section, we go to the next section
            if (!nextQuestion) {

                if (activeSection.nextSectionId) {
                    nextSection = survey.Sections2.find(section => section.id === activeSection.nextSectionId)
                }
                else {
                    nextSection = survey.Sections2.find(section => section.sectionOrder === activeSection.sectionOrder + 1)

                }


                console.log(nextSection)


                // If there is no next section, it means it is the end of the survey
                if (!nextSection) {



                    setEndOfSurvey(true);
                    return
                }

                nextQuestion = nextSection.Questions2.find(question => question.questionOrder === 1);

                console.log(nextQuestion)


            }

        }


        nextQuestion['fromRedirect'] = { sectionId: activeSection.id, questionId: activeQuestion.id };

        setActiveQuestion(nextQuestion)

    }


    function PreviousQuestion() {

        let previousQuestion = null;

        if (endOfSurvey) {
            setEndOfSurvey(false);
            return
        }


        // When we go one question back we need to remove the current question from the path
        setPath(prev => prev.filter(question => question !== activeQuestion.id))





        let newActiveSection = FindSectionById(activeQuestion.fromRedirect.sectionId);
        previousQuestion = newActiveSection.Questions2.find(question => question.id === activeQuestion.fromRedirect.questionId)



        // If there is no previous question in the current section, we go one section back and take the last question
        if (!previousQuestion) {

            let previousSection = survey.Sections2.find(section => section.sectionOrder === activeSection.sectionOrder - 1)

            previousQuestion = previousSection.Questions2.find(question => question.questionOrder === previousSection.Questions2.length);
        }


        setActiveQuestion(previousQuestion)

    }


    function SubmitAnswers() {

        // Converts the object to an array of [key, value]. We do this so we can compare to the path and only leave those that are included in the plath
        let ResponsesArray = Object.entries(selectedAnswers).filter(([key]) => path.includes(parseInt(key)))

        // Here we convert it back to an object
        let ResultResponses = Object.fromEntries(ResponsesArray)


        console.log(ResultResponses)
        // Foreach question we need to insert the selected answers in the database
        for (let question in ResultResponses) {
            AddAnswersToDb(ResultResponses[question])
        }
    }


    async function AddAnswersToDb(response) {

        try {

            // Change properties of object so we can add directly to database

            let newArray = response.map(answer => {
                return { questionId: answer.questionId, answerId: answer.id }
            })

            const { error } = await supabase
                .from('QuestionAnswer2')
                .insert(newArray)


            if (error) throw error;
        }

        catch (error) {
            console.log(error)
        }
    }



    /// HELPER FUNCTIONS ///
    function FindFirstQuestion(section) {
        return section.Questions2.find(question => question.questionOrder === 1)
    }


    function FindSectionById(id) {
        return survey.Sections2.find(section => section.id === id)
    }




    return (
        <div className="flex justify-center w-full h-[100%]">

            <div className="w-8/12 h-[50%]">
                <div className="flex justify-end mt-6">

                    <Link to={`/Editor/${id}`}>
                        <IconButton icon={FaPen} onClick={() => { }} className={' text-3xl '} />
                    </Link>
                </div>



                <div className="h-full mt-4 border border-gray-dark rounded-xl shadow-xl p-10 text-2xl">

                    <div className="flex items-center justify-between">


                        {

                            surveyLogo && surveyStyle ?
                                <div className={`${surveyStyle.logoPosition === 'end' ? 'order-1' : 'order-0'}`}>
                                    <SurveyLogo logo={surveyLogo} surveyStyle={surveyStyle} />
                                </div> : null
                        }



                        <h1 className={`
                                        mb-8
                                        text-${surveyStyle?.titleFontSize} 
                                        ${surveyStyle?.titleFontFamily} 
                                        ${surveyStyle?.titleIsBold ? "font-bold" : "font-normal"}
                                        ${surveyStyle?.titleIsCursive ? "italic" : "not-italic"}
                                        ${surveyStyle?.titleIsUnderlined ? "underline" : ""}
                                        `}
                        >
                            {survey?.title}
                        </h1>

                    </div>


                    {
                        endOfSurvey ? <div>GEDAAN</div> :
                            <div>
                                <p
                                    className={`
                                                text-${surveyStyle?.questionFontSize} 
                                                ${surveyStyle?.questionFontFamily} 
                                                ${activeQuestion?.isBold ? "font-bold" : "font-normal"}  
                                                ${activeQuestion?.isCursive ? "italic" : "not-italic"} 
                                                ${activeQuestion?.isUnderlined ? "underline" : "no-underline"}`}

                                >
                                    {activeQuestion?.questionOrder}. {activeQuestion?.questionContent}
                                </p>


                                <div className="flex flex-col mt-5">

                                    {

                                        activeQuestion?.questionKindId === 1 && <RadioButtonGroup key={activeQuestion.id} answers={activeQuestion?.Answers2} onChange={respons => setSelectedAnswers(prev => { return { ...prev, [activeQuestion.id]: respons } })} responses={selectedAnswers[activeQuestion.id]} /> ||
                                        activeQuestion?.questionKindId === 2 && <CheckboxGroup key={activeQuestion.id} answers={activeQuestion?.Answers2} onChange={respons => setSelectedAnswers(prev => { return { ...prev, [activeQuestion.id]: respons } })} responses={selectedAnswers[activeQuestion.id]} />
                                    }
                                </div>
                            </div>
                    }

                </div>
                <div className="flex items-center gap-3 mt-5">
                    <Button disabled={disablePrevious} onClick={PreviousQuestion} size="lg" className="w-40 bg-gray-light border-primary-normal text-primary-normal">Vorige</Button>
                    <Button disabled={disableNext} onClick={NextQuestion} size="lg" className="w-40 bg-primary">{endOfSurvey ? "Verzenden" : "Volgende"}</Button>
                </div>
            </div>
        </div>
    );
}



export default Preview;