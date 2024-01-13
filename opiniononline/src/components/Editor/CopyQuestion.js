import { FaRegCopy } from "react-icons/fa";
import IconButton from "../IconButton";
import { supabase } from "../../supabaseClient";

function CopyQuestion({ question }) {


    async function AddCopyToDb() {

        console.log(question);
        let copyOfQuestion = { ...question };

        delete copyOfQuestion.id
        copyOfQuestion.questionOrder = question.questionOrder ;

        let { errorUpdate } = await supabase
            .rpc('copy_question', {
                question_obj: question
            })


        if (errorUpdate) console.log( errorUpdate)

    }

    return (
        <IconButton icon={FaRegCopy} className={'m-2 text-4xl bg-white'} onClick={AddCopyToDb} />
    );
}



export default CopyQuestion