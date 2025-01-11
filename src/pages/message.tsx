import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Form, message, Select, TimePicker } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { telegramApi } from '../axios'
import useAxiosApi from '../hooks/use-axios-api'
import { weekdays } from '../types'

const Message = () => {
  const [form] = Form.useForm()
  const api = useAxiosApi()
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
        message.error('Xabarni rejalashtirishda xatolik yuz berdi')
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
        sendTime: values.sendTime ? values.sendTime.format('HH:mm') : undefined,
        interval: values.interval,
        weekday: values.weekdays ? values.weekdays : undefined,
      }

      if (values.interval !== 'ONCE') {
        mutate(sendData)
        message.success('Xabar yuborish rejalashtirildi')
      } else {
        for (const group of groups) {
          await telegramApi.post('/sendMessage', {
            chat_id: `-${group.groupId}`,
            text: values.message,
          })
        }

        message.success('Xabar muvaffaqiyatli yuborildi')
      }
      setIsSubmitting(false)
    },
    [mutate, groups]
  )

  return (
    <div className="flex flex-col items-center justify-center w-full p-10 md:p-24 bg-white rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-7">
        Oddiy xabar yuborish
      </h1>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="w-full"
      >
        <Form.Item
          label={<span className="text-gray-800">Xabar matni</span>}
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
            className="bg-transparent border border-gray-300 rounded-lg p-2 w-full"
          />
        </Form.Item>

        <Form.Item name="interval" label="Interval">
          <Select
            onChange={setMessageInterval}
            defaultValue={messageInterval}
            className="w-full"
          >
            <Select.Option value="ONCE">Bir marta</Select.Option>
            <Select.Option value="HOURLY">Har soatda</Select.Option>
            <Select.Option value="DAILY">Har kuni</Select.Option>
            <Select.Option value="WEEKLY">Hafta kunlari</Select.Option>
          </Select>
        </Form.Item>

        {messageInterval === 'WEEKLY' && (
          <Form.Item label="Hafta kunlari" name="weekdays">
            <Select
              mode="multiple"
              onChange={setSelectedWeekdays}
              defaultValue={selectedWeekdays}
              className="w-full"
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
            <TimePicker className="w-full" format="HH:mm" showSecond={false} />
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
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg w-full md:w-auto mt-4"
          >
            Orqaga
          </Button>
        </Link>
      </Form>
    </div>
  )
}

export default Message
