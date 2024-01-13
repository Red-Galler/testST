function StatusPicker({ active }) {
    const statuses = [
        {
            Name: 'Concept',
            Color: 'bg-blue-400'
        },
        {
            Name: 'Voltooid',
            Color: 'bg-gray-400'
        },
        {
            Name: 'In behandeling',
            Color: 'bg-yellow-400'
        },


    ]
    return (
        <div className={`absolute w-full z-10 transition-all duration-200 ease-in-out ${active ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
            <div className="bg-white border shadow-lg rounded-md mx-2">
                <ul>
                    {
                        statuses.map((status) => (
                            <li key={status.Name} className="mt-2 px-5 py-1 hover:bg-gray-200">
                                <div className="flex items-center gap-5">
                                    <div className={`w-4 h-4 rounded-2xl ${status.Color}`}></div>
                                    <p className="text-lg">{status.Name}</p>
                                </div>
                            </li>
                        ))
                    }

                </ul>
            </div>

        </div>
    )
}

export default StatusPicker;