import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, message, Popconfirm } from 'antd'
import { FaTrashCan } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import useAxiosApi from '../hooks/use-axios-api'

const Group: React.FC = () => {
  const api = useAxiosApi()
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await api.post('/group/find-many', {})
      return response.data
    },
  })

  const { mutate } = useMutation({
    mutationKey: ['delete-group'],
    mutationFn: async (id: string) => {
      try {
        await api.post(`/group/delete`, {
          where: {
            id,
          },
        })
      } catch (error) {
        console.error('Error deleting group:', error)
        message.error('Failed to delete group')
      }
    },
  })

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-white mb-12">
        Bot azo bo&apos;lgan guruhlar
      </h1>
      <div className="flex items-center mb-3">
        <Link to={'/'}>
          <Button>Bosh sahifaga</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.map((group: Record<string, any>, index: number) => (
          <div
            className="bg-white flex items-center justify-between rounded-lg shadow-lg p-6"
            key={index}
          >
            <h2 className="text-2xl font-bold">{group.title}</h2>
            <Popconfirm
              title="Bu guruhni o'chirishni tasdiqlaysizmi?"
              onConfirm={() => mutate(group.id)}
              okText="Ha"
              cancelText="Yo'q"
            >
              <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                <FaTrashCan />
              </button>
            </Popconfirm>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Group
