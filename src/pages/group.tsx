import { useQuery } from '@tanstack/react-query'
import { api } from '../axios'

const Group = () => {
    const { data: groups } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const response = await api.post('/group/find-many', {})
            return response.data
        },
    })

    console.log('dsfs')
    return (
        <div className="flex flex-col items-center justify-center bg-blue-500 w-full">
            <h1 className="text-2xl font-bold text-white drop-shadow-md mb-12">
                Oddiy xabar yuborish
            </h1>
            <div className="flex flex-col gap-4">
                {groups?.map((group: Record<string, any>, index: number) => (
                    <div className="flex items-center gap-4" key={index}>
                        <div className="bg-gray-200 p-4 rounded-md">
                            {group.name}
                        </div>
                        <div className="bg-gray-200 p-4 rounded-md">
                            {group.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Group
