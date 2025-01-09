import { useMutation } from '@tanstack/react-query'
import { Button, Form, Select, TimePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../axios'
import { weekdays } from '../types'

const Message = () => {
    const { mutate } = useMutation({
        mutationKey: ['add-message'],
        mutationFn: async (data: Record<string, any>) => {
            await api.post('/message/create', { data })
        },
    })
    const [messageInterval, setMessageInterval] = useState<string>('ONCE')
    const [form] = Form.useForm()
    const [selectedWeekdays, setSelectedWeekdays] = useState<weekdays[]>([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
    ])

    useEffect(() => {
        form.setFieldsValue({
            weekdays: selectedWeekdays,
            interval: messageInterval,
        })
    }, [])
    const onFinish = useCallback(
        (values: Record<string, any>) => {
            if (messageInterval !== 'Bir marta') {
                mutate({
                    text: values.message,
                    sendTime: values.sendTime.format('HH:mm'),
                    interval: messageInterval,
                })
            }
        },
        [messageInterval, mutate]
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
                    name={'message'}
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
                <Form.Item name={'interval'} label="Interval">
                    <Select
                        onChange={(value) => {
                            console.log(value)
                            setMessageInterval(value)
                        }}
                    >
                        <Select.Option value="ONCE">Bir marta</Select.Option>
                        <Select.Option value="HOURLY">Har soatda</Select.Option>
                        <Select.Option value="DAYLY">Har kuni</Select.Option>
                        <Select.Option value="WEEKLY">
                            Hafta kunlari
                        </Select.Option>
                    </Select>
                </Form.Item>
                {messageInterval === 'WEEKLY' && (
                    <Form.Item label="Hafta kunlari" name={'weekdays'}>
                        <Select
                            mode="multiple"
                            onChange={(value) => setSelectedWeekdays(value)}
                            defaultValue={selectedWeekdays}
                        >
                            <Select.Option value="HOURLY">
                                Har soatda
                            </Select.Option>
                            <Select.Option value="DAYLY">
                                Har kuni
                            </Select.Option>
                            <Select.Option value="WEEKLY">
                                Hafta kunlari
                            </Select.Option>
                        </Select>
                    </Form.Item>
                )}
                <Form.Item
                    name={'sendTime'}
                    label="Yuborish vaqti"
                    rules={[
                        {
                            required: true,
                            message: 'Yuborish vaqti kiritilmagan!',
                        },
                    ]}
                >
                    <TimePicker className="w-full" showSecond={false} />
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
                <Link to={'/'}>
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
