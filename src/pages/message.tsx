import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, Select, TimePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, telegramApi } from '../axios'
import { weekdays } from '../types'

const Message = () => {
    const [form] = Form.useForm()
    const [sendTime, setSendTime] = useState(form.getFieldValue('sendTime'))
    const [messageInterval, setMessageInterval] = useState<string>('ONCE')
    const [selectedWeekdays, setSelectedWeekdays] = useState<weekdays[]>([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
    ])

    const { mutate } = useMutation({
        mutationKey: ['add-message'],
        mutationFn: async (data: Record<string, any>) => {
            try {
                await api.post('/message/create', { data })
            } catch (error) {
                console.error('Error creating message:', error)
                throw new Error('Failed to create message')
            }
        },
    })

    const { data: groups = [] } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const response = await api.post('/group/find-many', {})
            return response.data
        },
    })

    useEffect(() => {
        form.setFieldsValue({
            weekdays: selectedWeekdays,
            interval: messageInterval,
        })
    }, [form, selectedWeekdays, messageInterval])

    useEffect(() => {
        let intervalId: NodeJS.Timeout
        if (sendTime) {
            const checkTime = () => {
                const currentTime = new Date().toISOString().slice(11, 16) // Only hours and minutes
                if (currentTime === sendTime) {
                    try {
                        for (const group of groups) {
                            telegramApi.post('/sendMessage', {
                                chat_id: `-${group.groupId}`,
                                text: form.getFieldValue('message'),
                            })
                        }
                        console.log('Messages sent successfully!')
                        clearInterval(intervalId) // Stop the interval after sending messages
                    } catch (error) {
                        console.error('Error sending messages:', error)
                    }
                }
            }
            intervalId = setInterval(checkTime, 1000) // Check time every second
        }

        return () => clearInterval(intervalId) // Clean up on component unmount
    }, [sendTime, groups, form])

    const onFinish = useCallback(
        (values: Record<string, any>) => {
            console.log('Form submitted:', values)

            const sendData = {
                text: values.message,
                sendTime: values.sendTime.format('HH:mm'),
                interval: values.interval,
                weekday: values.weekdays ? values.weekdays : null,
            }

            if (values.interval !== 'ONCE') {
                console.log('Sending data:', sendData)

                const now = new Date()
                const sendTime = new Date()
                const [hours, minutes] = values.sendTime
                    .format('HH:mm')
                    .split(':')
                sendTime.setHours(parseInt(hours), parseInt(minutes), 0)

                const timeDifference = sendTime.getTime() - now.getTime()
                const delay = timeDifference > 0 ? timeDifference : 0

                setTimeout(() => {
                    // Logic to send the message
                    console.log('Message sent:', sendData)
                    mutate(sendData)

                    if (values.interval !== 'ONCE') {
                        const intervalId = setInterval(
                            () => {
                                console.log('Message sent:', sendData)
                            },
                            values.interval === 'DAILY' ? 86400000 : 604800000
                        ) // Daily or Weekly

                        // Clean up interval on component unmount
                        return () => clearInterval(intervalId)
                    }
                }, delay)
            } else {
                const now = new Date()
                const sendTime = new Date()
                const [hours, minutes] = values.sendTime
                    .format('HH:mm')
                    .split(':')
                sendTime.setHours(parseInt(hours), parseInt(minutes), 0)

                const timeDifference = sendTime.getTime() - now.getTime()
                const delay = timeDifference > 0 ? timeDifference : 0

                setTimeout(() => {
                    // Logic to send the message
                    console.log('Message sent:', sendData)
                    for (const group of groups) {
                        telegramApi.post('/sendMessage', {
                            chat_id: `-${group.groupId}`,
                            text: values.message,
                        })
                    }
                }, delay)
            }
        },
        [messageInterval, mutate, selectedWeekdays]
    )

    return (
        <div className="flex flex-col items-center justify-center bg-blue-500 w-full">
            <h1 className="text-2xl font-bold text-white drop-shadow-md mb-12">
                Oddiy xabar yuborish
            </h1>

            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className="bg-white rounded-lg shadow-lg p-6 w-full"
            >
                <Form.Item
                    label={<span className="text-black">Xabar matni</span>}
                    name="message"
                    rules={[
                        {
                            required: true,
                            message: 'Xabar matni kiritilmagan!',
                        },
                    ]}
                >
                    <TextArea
                        rows={4}
                        className="bg-transparent text-black border-2 border-gray-300 rounded-lg p-2"
                    />
                </Form.Item>

                <Form.Item name="interval" label="Interval">
                    <Select
                        onChange={setMessageInterval}
                        defaultValue={messageInterval}
                    >
                        <Select.Option value="ONCE">Bir marta</Select.Option>
                        <Select.Option value="HOURLY">Har soatda</Select.Option>
                        <Select.Option value="DAILY">Har kuni</Select.Option>
                        <Select.Option value="WEEKLY">
                            Hafta kunlari
                        </Select.Option>
                    </Select>
                </Form.Item>

                {messageInterval === 'WEEKLY' && (
                    <Form.Item label="Hafta kunlari" name="weekdays">
                        <Select
                            mode="multiple"
                            onChange={setSelectedWeekdays}
                            defaultValue={selectedWeekdays}
                        >
                            {[
                                'MONDAY',
                                'TUESDAY',
                                'WEDNESDAY',
                                'THURSDAY',
                                'FRIDAY',
                                'SATURDAY',
                                'SUNDAY',
                            ].map((day) => (
                                <Select.Option key={day} value={day}>
                                    {day}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item
                    name="sendTime"
                    label="Yuborish vaqti"
                    rules={[
                        {
                            required: true,
                            message: 'Yuborish vaqti kiritilmagan!',
                        },
                    ]}
                >
                    <TimePicker
                        onChange={(value) =>
                            setSendTime(value?.format('HH:mm'))
                        }
                        className="w-full"
                        format="HH:mm"
                        showSecond={false}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        size="large"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full md:w-auto"
                    >
                        Yuborish
                    </Button>
                </Form.Item>

                <Link to="/">
                    <Button
                        size="large"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg w-full md:w-auto"
                    >
                        Orqaga
                    </Button>
                </Link>
            </Form>
        </div>
    )
}

export default Message
