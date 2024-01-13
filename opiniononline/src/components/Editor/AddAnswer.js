import { Checkbox, Radio } from "@material-tailwind/react";
import { supabase } from "../../supabaseClient";
import { useState } from "react";

function AddAnswer({ question, answersCount }) {

    const [isSaving, setIsSaving] = useState(false); // Add state to track saving status


    async function InsertAnswerIntoDb() {
        if (isSaving) {
            return
        }

        setIsSaving(true);

        try {
            // Checks if there is a next section.
            const { data, error } = await supabase.from('Sections2').select('id').eq('id', question.sectionId + 1).maybeSingle();

            let answer = { questionId: question.id, answerContent: `Optie ${answersCount + 1}`, nextSectionId: null, orderNr: answersCount + 1 }

            if (error) throw error;

            // If there is a next section available, it assigns the sectionId to the nextSectionId prop of answer
            if (data) {
                answer.nextSectionId = data.id;
            }

            const { insertError } = await supabase
                .from('Answers2')
                .insert(answer);



            if (insertError) throw insertError

            setIsSaving(false);


        }
        catch (error) {
            setIsSaving(false);
            console.log(error)
        }




    }

    return (
        <div className="flex items-center mt-2 gap-3">
            {
                question.questionKindId === 1 && <Radio className='mb-3' color="green" disabled /> ||
                question.questionKindId === 2 && <Checkbox className='mb-3' color="green" disabled /> ||
                question.questionKindId === 3 && <span className='text-2xl mb-1'>{answersCount + 1}.</span>  // Display a numbered item, adjust as necessary

            }
            <p className="text-xl mb-4"><span onClick={InsertAnswerIntoDb}>Optie toevoegen </span></p>
        </div>
    );

}





export default AddAnswer;