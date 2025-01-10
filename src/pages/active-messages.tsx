import { useQuery } from '@tanstack/react-query'
import { Button, Segmented, Space, Spin, Table, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { FaTrashCan } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { api } from '../axios'

type MessageType = 'message' | 'photo'

const ActiveMessages = () => {
    const { Title } = Typography
    const {
        data: messages,
        isLoading,
        refetch: refetchMessages,
    } = useQuery({
        queryKey: ['active-messages'],
        queryFn: async () => {
            const data = await api.post('/message/find-many', {})
            return data.data
        },
    })

    const {
        data: photos,
        isLoading: isLoadingPhotos,
        refetch: refetchPhotos,
    } = useQuery({
        queryKey: ['active-photos'],
        queryFn: async () => {
            const data = await api.post('/photo/find-many', {})
            return data.data
        },
    })

    const [segmentedValue, setSegmentedValue] = useState<MessageType>('message')

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (text: string) => <a>{text}</a>,
            ellipsis: true,
        },
        {
            title: 'Xabar matni',
            dataIndex: 'text',
            key: 'text',
            ellipsis: true,
        },
        {
            title: 'Vaqti',
            dataIndex: 'sendTime',
            key: 'sendTime',
            ellipsis: true,
        },
        {
            title: 'Intervallari',
            dataIndex: 'interval',
            key: 'interval',
            ellipsis: true,
        },
        {
            title: 'Amallar',
            dataIndex: 'actions',
            key: 'actions',
            render: (id: string) => (
                <Space>
                    <Button
                        onClick={async () => {
                            try {
                                await api.post('/message/delete', {
                                    where: {
                                        id,
                                    },
                                })
                                refetchMessages()
                                refetchPhotos()
                            } catch (error) {
                                console.log(error)
                            }
                        }}
                        type="primary"
                        danger
                    >
                        <FaTrashCan />
                    </Button>
                </Space>
            ),
            ellipsis: true,
        },
    ]

    const dataToShow = useMemo(
        () => (segmentedValue === 'message' ? messages : photos),
        [segmentedValue, messages, photos]
    )

    if (isLoading && isLoadingPhotos) {
        return (
            <div className="flex w-full items-center justify-center h-screen">
                <Spin />
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
            <Title level={3}>Aktiv xabarlar</Title>
            <Segmented
                options={[
                    { label: 'Oddiy', value: 'message' },
                    { label: 'Rasmli', value: 'photo' },
                ]}
                value={segmentedValue}
                onChange={(value) => setSegmentedValue(value as MessageType)}
            />
            <div className="mt-2">
                <Link className="" to={'/'}>
                    <Button type="primary">Bosh sahifa</Button>
                </Link>
            </div>
            <div className="mt-6">
                <Table
                    columns={columns}
                    scroll={{ x: 'max-content' }}
                    dataSource={
                        dataToShow
                            ? dataToShow.map(
                                  (
                                      item: Record<string, any>,
                                      index: number
                                  ) => ({
                                      ...item,
                                      text:
                                          segmentedValue === 'message'
                                              ? item.text
                                              : item.caption,
                                      key: index,
                                      index: index + 1,
                                      actions: item.id,
                                  })
                              )
                            : []
                    }
                    pagination={false}
                    className="text-sm"
                />
            </div>
        </div>
    )
}

export default ActiveMessages
