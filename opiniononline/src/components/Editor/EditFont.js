import { Option, Select, Spinner } from "@material-tailwind/react";
import HeaderStyles from "./HeaderStyles";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../supabaseClient";
import surveySlice, { updateSurveyStyles } from "../../slices/surveySlice";
import IconButton from "../IconButton";
import { FaBold, FaItalic, FaRemoveFormat, FaUnderline } from "react-icons/fa";
import FontStylingOptions from "./FontStylingOptions";

function EditFont({ onBack }) {
    const dispatch = useDispatch();



    const surveyStyle = useSelector(state => state.surveys.surveyStyles)

    const [updatedSurveyStyle, setUpdatedSurveyStyle] = useState(surveyStyle);

    const isInitialRender = useRef([true]);



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
                .eq('id', surveyStyle.id)

            if (error) throw error;

            dispatch(updateSurveyStyles(updatedSurveyStyle));

        }

        UpdateStyle()

    }, [updatedSurveyStyle])


    return (
        <div>
            <HeaderStyles title={'Lettertypen'} onBack={onBack} />

            <FontStylingOptions
                label="Titel"
                values={{
                    fontFamily: updatedSurveyStyle.titleFontFamily,
                    fontSize: updatedSurveyStyle.titleFontSize,
                    isBold: updatedSurveyStyle.titleIsBold,
                    isCursive: updatedSurveyStyle.titleIsCursive,
                    isUnderlined: updatedSurveyStyle.titleIsUnderlined
                }}
                onSelectChanges={{
                    onFontFamilyChange: (newValue) => setUpdatedSurveyStyle(prev => ({ ...prev, titleFontFamily: newValue })),
                    onFontSizeChange: (newValue) => setUpdatedSurveyStyle(prev => ({ ...prev, titleFontSize: newValue }))
                }}
                onButtonClicks={{
                    Bold: () => setUpdatedSurveyStyle(prev => ({ ...prev, titleIsBold: !updatedSurveyStyle.titleIsBold })),
                    Cursive: () => setUpdatedSurveyStyle(prev => ({ ...prev, titleIsCursive: !updatedSurveyStyle.titleIsCursive })),
                    Underlined: () => setUpdatedSurveyStyle(prev => ({ ...prev, titleIsUnderlined: !updatedSurveyStyle.titleIsUnderlined }))
                }}
            />



            <FontStylingOptions
                label="Vraag"
                values={{
                    fontFamily: updatedSurveyStyle.questionFontFamily,
                    fontSize: updatedSurveyStyle.questionFontSize,
                }}
                onSelectChanges={{
                    onFontFamilyChange: (newValue) => setUpdatedSurveyStyle(prev => ({ ...prev, questionFontFamily: newValue })),
                    onFontSizeChange: (newValue) => setUpdatedSurveyStyle(prev => ({ ...prev, questionFontSize: newValue }))
                }}
                onButtonClicks={{
                }}
                showButtons={false}
            />


        </div>
    );
}


export default EditFont;