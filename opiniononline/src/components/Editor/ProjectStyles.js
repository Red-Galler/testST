import { FaPlusCircle } from "react-icons/fa";
import ProjectStyleBox from "./ProjectStyleBox";
import { useEffect, useState } from "react";
import EditLogo from "./EditLogo";
import { useSelector } from "react-redux";
import EditFont from "./EditFont";



function ProjectStyles({ className }) {

    const [selectedBox, setSelectedBox] = useState(null);

    const surveyLogo = useSelector(state => state.surveys.logo);


    function RenderComponent() {
        switch (selectedBox) {
            case "Logo":
                return <EditLogo onBack={onBack} />
            case "Font":
                return <EditFont onBack={onBack} />
            default:
                break;
        }
    }




    function onBack() {
        setSelectedBox(null)
    }


    function StyleElement(element) {
        console.log(element)
        setSelectedBox(element)
    }


    return (
        <div className={`${className}`}>
            <div className="flex gap-3 justify-center border border-gray-normal p-4">
                <h2>Instellingen</h2>
                <h2>Thema's</h2>
            </div>

            {
                selectedBox ? <div className="bg-third">{RenderComponent()}</div> :
                    <div className="grid grid-cols-2">
                        <ProjectStyleBox
                            className={'border'}
                            title={"Uw logo"}
                            content={<img className="w-4/12" src={surveyLogo} alt='logo'></img> || <FaPlusCircle className="text-3xl text-gray-400" />}
                            onClick={() => StyleElement("Logo")} />
                        <ProjectStyleBox
                            className={'border border-s-0'} title={"Voettekst"} />
                        <ProjectStyleBox
                            className={'border border-t-0'}
                            title={"Teksstijl"}
                            content={<p className="text-5xl text-gray-400">Aa</p>}
                            onClick={() => StyleElement("Font")} />

                        <ProjectStyleBox className={'border border-s-0 border-t-0'} title={"Thema"} />
                    </div>
            }
        </div>
    );
}


export default ProjectStyles;