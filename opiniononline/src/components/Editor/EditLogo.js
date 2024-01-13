import { FaChevronLeft, FaPlusCircle } from "react-icons/fa";
import IconButton from "../IconButton";
import { Button, Option, Radio, Select } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";
import { useEffect, useRef, useState } from "react";
import { fetchSurveyLogo, updateLogo, updateSurveyLogo, updateSurveyStyles } from "../../slices/surveySlice";
import { useParams } from "react-router-dom";
import HeaderStyles from "./HeaderStyles";


function EditLogo({ onBack }) {
    const { id } = useParams();
    const inputButton = useRef();
    const [loading, setLoading] = useState(false);

    const sizes = [
        {
            logoSize: '12',
            label: 'Klein'
        },
        {
            logoSize: '16',
            label: 'Middelgroot'
        },
        {
            logoSize: '20',
            label: 'Groot'
        }
    ]

    const surveyLogo = useSelector(state => state.surveys.logo)

    const surveyStyles = useSelector(state => state.surveys.surveyStyles);

    const dispatch = useDispatch();



    const [updatedSurveyStyles, setUpdatedSurveyStyles] = useState(surveyStyles);


    useEffect(() => {

        async function updateSurveyStylesInDb() {

            try {
                const { error } = await supabase.from('SurveyStyles2').update({ logoSize: updatedSurveyStyles.logoSize, logoPosition: updatedSurveyStyles.logoPosition }).eq("surveyId", updatedSurveyStyles.surveyId);

                if (error) throw error;

                dispatch(updateSurveyStyles(updatedSurveyStyles));

            }
            catch (error) {
                console.log(error)
            }

        }

        updateSurveyStylesInDb();

    }, [updatedSurveyStyles])


    useEffect(() => {
        console.log('ddkd')
    }, [surveyLogo])



    async function handleImageUpdate(e) {
        try {

            let file = e.target.files[0];
            let filename = `survey_${updatedSurveyStyles.surveyId}`

            if (!file) return

            setLoading(true);


            const { error } = await supabase
                .storage
                .from('survey_logos')
                .update(filename, file, {
                    cacheControl: '0',
                    upsert: true
                })

            if (error) {
                const { data2, error2 } = await supabase
                    .storage
                    .from('survey_logos')
                    .upload(filename, file, {
                        cacheControl: '3600',
                        upsert: false
                    })
            };

            dispatch(updateLogo(URL.createObjectURL(file)));

            setLoading(false);
        }

        catch (error) {
            setLoading(false)
            console.log(error)
        }


    }

    return (
        <div>
            <HeaderStyles title={'Logo wijzigen'} onBack={onBack} />

            <div className=" border-x border-b border-gray-dark p-6">
                <Button type="file" onClick={() => inputButton.current.click()} size="md" className="bg-primary p-0">
                    {
                        surveyLogo ? <img key={surveyLogo} src={surveyLogo} alt="logo" className="w-20 h-20 flex-1"></img> :
                            <div className="flex items-center gap-3  text-lg">
                                <FaPlusCircle />
                                <span>Logo</span>
                            </div>
                    }
                    <input ref={inputButton} type="file" onChange={(e) => handleImageUpdate(e)} className="hidden"></input>
                </Button>
            </div>

            <div className="flex flex-col  border-x border-b border-gray-dark p-6">
                <p className="ms-3 font-semibold">Grootte</p>

                {
                    sizes.map((size) => {
                        return <Radio checked={updatedSurveyStyles.logoSize === size.logoSize} value={size.logoSize} name="size" label={size.label} color="green" onChange={() => setUpdatedSurveyStyles(prev => ({ ...prev, logoSize: size.logoSize }))} />
                    })
                }

            </div>


            <div className="flex flex-col  border-x border-b border-gray-dark p-6">
                <p className="ms-3 font-semibold">Positie</p>
                <div className="ms-3 mt-3">
                    <Select labelProps={{
                        className: 'before:mr-0 after:ml-0 before:pr-0 after:pl-0'
                    }}
                        onChange={(value) => setUpdatedSurveyStyles(prev => ({ ...prev, logoPosition: value }))}
                        value={updatedSurveyStyles.logoPosition}

                    >
                        <Option value="start">Links</Option>
                        <Option value="end">Rechts</Option>
                    </Select>

                </div>

            </div>
        </div>
    )
}




export default EditLogo;