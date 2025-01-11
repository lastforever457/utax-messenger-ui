import { Col, Row } from 'antd'
import { Link } from 'react-router-dom'

const Main = () => {
  return (
    <div className="w-full h-full">
      <img src="/utax-logo.png" alt="" className="md:w-1/2 mx-auto" />
      <div className="flex flex-col gap-4 mt-12 md:flex-row md:gap-8 md:justify-center">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={12}>
            <div className="w-full h-full flex justify-center items-center">
              <Link
                to={'message'}
                className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full text-lg font-semibold text-blue-500 hover:text-blue-700 hover:bg-gray-100 transition-all duration-300"
              >
                Oddiy xabar yuborish
              </Link>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12}>
            <div className="w-full h-full flex justify-center items-center">
              <Link
                to={'photo'}
                className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full text-lg font-semibold text-green-500 hover:text-green-700 hover:bg-gray-100 transition-all duration-300"
              >
                Rasmli xabar yuborish
              </Link>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12}>
            <div className="w-full h-full flex justify-center items-center">
              <Link
                to={'group'}
                className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full text-lg font-semibold text-yellow-500 hover:text-yellow-700 hover:bg-gray-100 transition-all duration-300"
              >
                Bot a&apos;zo bo&apos;lgan guruhlar
              </Link>
            </div>
          </Col>
          <Col xs={24} md={12} lg={12}>
            <div className="w-full h-full flex justify-center items-center">
              <Link
                to={'active'}
                className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full text-lg font-semibold text-blue-500 hover:text-blue-700 hover:bg-gray-100 transition-all duration-300"
              >
                Aktiv xabarlar
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Main
