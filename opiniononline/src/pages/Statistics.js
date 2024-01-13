import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from "../supabaseClient";
import { fetchSurveyData, updateSectionsList } from '../slices/surveySlice';
import { FaEllipsisV, FaCopy } from "react-icons/fa";

import { Chart } from "react-google-charts";

// import Nav from "../Nav/Nav"

import ProjectStyles from "../components/Editor/ProjectStyles";
import Section from "../components/Editor/Section";
import IconButton from "../components/IconButton";
import ToolBarSide from "../components/Editor/ToolBarSide";

import { FaPalette, FaArrowLeft, FaArrowRight, FaRegEye } from "react-icons/fa";
import ToolBarBottom from "../components/Editor/ToolBarBottom";


function Statistics() {
    const dispatch = useDispatch();

    const { id } = useParams();
    const sections = useSelector(state => state.surveys.sections);

    useEffect(() => {
        dispatch(fetchSurveyData(id));

    }, [id, dispatch]);


    const data = [
        ["Task", "Hours per Day"],
        ["Yes", 11],
        ["No", 2],
    ];

    const options = {
        pieHole: 0.4,
        is3D: false,
        slices: {
            0: { color: '#81c784' },
            1: { color: '#9e9e9e' }
          }
    };
    const activeBlock = useSelector(state => state.surveys.active);

    // Stores the active section or question. So if activeBlock changes it stores the div in this ref
    const ref = useRef(null);


    useEffect(() => {

        setTimeout(() => {

            if (ref.current) {
                ref.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 150);


    }, [activeBlock])


    useEffect(() => {
        const subscription = supabase
            .channel(`project ${id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Sections2' }, payload => {
                switch (payload.eventType) {
                    case 'INSERT':

                        // When a new section is added, the list of sections need to get updated
                        dispatch(updateSectionsList(payload.new))

                        break;
                    case 'DELETE':
                        break;
                    case 'UPDATE':
                        //TODO///
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




    return (
        <div className="flex w-full bg-gray-light">

            {/* Left Sidebar */}
            <div className="w-1/4 h-full bg-white text-left">
                <div className="rectangle-5">
                    <div className="aantal-antwoorden py-20 px-2 border border-gray-200">
                        <div>
                            <div className="flex justify-between">
                                <p>Aantal antwoorden</p>
                                <IconButton icon={FaEllipsisV} message={'Meer'} />
                            </div>
                        </div>

                    </div>

                    <div className="p-2 border border-gray-200">Overzicht</div>
                    <div className="p-2 border border-gray-200">Vraag</div>
                    <div className="p-2 border border-gray-200">Individueel</div>
                </div>
            </div>

            {/* Right Canvas */}
            <div className="w-full md:w-3/4 p-4 flex flex-col items-center">
                <div className="w-4/5 bg-white border border-gray-dark p-4 m-2 text-left">
                    <div className="flex justify-between">
                        <div>
                            <h1>Vraag</h1>
                            <p>Aantal antwoorden</p>
                        </div>
                        <div className="text-right">
                            <IconButton icon={FaCopy} message={'Copy'} />
                        </div>
                    </div>
                    <div className="rectangle-10 p-2">
                        {/* Content for the first "card" */}

                        <Chart
                            chartType="PieChart"
                            data={data}
                            options={options}
                            width={"100%"}
                            height={"400px"}
                        />
                    </div>
                </div>

               

            </div>
        </div>
    );
}

export default Statistics;