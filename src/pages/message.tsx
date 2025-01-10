import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, message, Select, TimePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, telegramApi } from '../axios'
import { weekdays } from '../types'

const Message = () => {
    const [form] = Form.useForm()
    const [messageInterval, setMessageInterval] = useState<string>('ONCE')
    const [selectedWeekdays, setSelectedWeekdays] = useState<weekdays[]>([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
    ])
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const onFinish = useCallback(
        async (values: Record<string, any>) => {
            setIsSubmitting(true)
            if (!groups?.length) {
                message.error('Guruhlar ro`yhati bo`sh')
                setIsSubmitting(false)
                return
            }

            const sendData = {
                text: values.message,
                sendTime: values.sendTime
                    ? values.sendTime.format('HH:mm')
                    : undefined,
                interval: values.interval,
                weekday: values.weekdays ? values.weekdays : undefined,
            }

            if (values.interval !== 'ONCE') {
                mutate(sendData)
            } else {
                console.log('hello')
                for (const group of groups) {
                    await telegramApi.post('/sendMessage', {
                        chat_id: `-${group.groupId}`,
                        text: values.message,
                    })
                }
            }
            setIsSubmitting(false)
        },
        [mutate, groups]
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

                {messageInterval !== 'ONCE' && (
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
                            className="w-full"
                            format="HH:mm"
                            showSecond={false}
                        />
                    </Form.Item>
                )}

                <Form.Item>
                    <Button
                        htmlType="submit"
                        type="primary"
                        size="large"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full md:w-auto"
                        disabled={isSubmitting}
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
