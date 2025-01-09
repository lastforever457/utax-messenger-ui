import { Button, Form, Input } from 'antd'

const Message = () => {
    return (
        <div>
            <h1>Oddiy xabar yuborish</h1>

            <Form>
                <Form.Item name={'message'}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">Yuborish</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Message
