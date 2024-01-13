import { Radio } from "@material-tailwind/react";
import { useEffect, useState } from "react";

function RadioButtonGroup({ answers, onChange, responses = [] }) {

    const [selectedOption, setSelectedOption] = useState(responses);


    function HandleChange(option) {

        // We use an array because it is easier to work with in preview.js. We also did the same for checkbox answers
        setSelectedOption([option]);
    }


    useEffect(() => {


        onChange(selectedOption);

    }, [selectedOption])


    return (
        <div>
            <div className="flex flex-col">
                {
                    answers.map((answer) => {
                        return <Radio checked={selectedOption[0]?.id === answer.id} name="answer" label={answer.answerContent} color="green" key={answer.id} onChange={() => { HandleChange(answer) }} />
                    })
                }
            </div>

        </div>
    )
}


export default RadioButtonGroup;