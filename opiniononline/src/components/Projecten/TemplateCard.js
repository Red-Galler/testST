import { FaWpforms } from "react-icons/fa";


function TemplateCard() {
    return (
        <div className="flex flex-col w-7/12 sm:w-4/12 lg:w-3/12 2xl:w-2/12  h-[200px] border border-gray-dark bg-gray-light rounded-xl">

            <div className="flex-1 bg-white rounded-t-xl"></div>


            <div className="flex items-center gap-2 py-1 px-3 border-t bg-white border-gray-dark rounded-b-xl">
                <FaWpforms className="text-primary-normal text-4xl" />
                <div className="text-start">
                    <p>Naam sjabloon</p>
                    <p className="text-gray-dark">Sjabloon</p>
                </div>
            </div>

        </div>
    )
}


export default TemplateCard;