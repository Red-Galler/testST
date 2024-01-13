import { FaRegTrashAlt } from "react-icons/fa";
import IconButton from "../IconButton";
import { supabase } from "../../supabaseClient";
import { useState } from "react";


function DeleteQuestion({ question }) {

    const [isDeleting, setIsDeleting] = useState(false); // Add state to track saving status

    async function DeleteFromDb() {
        if (isDeleting) {
            return
        }

        setIsDeleting(true);

        try {

            const { errorDelete } = await supabase.from('Questions2').delete().eq('id', question.id)

            if (errorDelete) throw errorDelete

            // Runs a stored procedure that is store in Supabase. with rpc we can access the function.
            // The function subtracts 1 from the answerOrderNrs if it is greater then 'deleted_ordernr'
            // If the 'deleted_ordernr' is 1, it subtracts 1 from all the answers
            let { errorUpdate } = await supabase
                .rpc('subtract_question_order_nr', {
                    deleted_ordernr: question.questionOrder,
                    section_id: question.sectionId
                })


            if (errorUpdate) throw errorUpdate
            setIsDeleting(false);


        }
        catch (error) {
            setIsDeleting(true);
            console.log(error)
        }

    }

    return (
        <IconButton icon={FaRegTrashAlt} className={'m-2 text-4xl bg-white'} onClick={DeleteFromDb} />
    );
}



export default DeleteQuestion;