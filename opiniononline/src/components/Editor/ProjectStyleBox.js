function ProjectStyleBox({ className, title, content = null, onClick }) {
    return (
        <div onClick={onClick} className={`${className} flex flex-col h-48 p-3 border-gray-normal`}>
            <p  className="text-start mb-2">{title}</p>

            <div  className="flex-1 flex items-center justify-center border border-gray-normal shadow-md p-1">
                {content}
            </div>

        </div>
    );
}


export default ProjectStyleBox;