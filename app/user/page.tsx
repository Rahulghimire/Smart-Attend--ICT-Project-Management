'use client';

import { useState } from 'react';
import {
  Layout,
  Menu,
  Card,
  Table,
  Form,
  Select,
  Button,
  Typography,
  Divider,
  Tag,
  Progress,
  message,
} from 'antd';
import {
  QrCode,
  History,
  Home,
  Users,
  Bell,
  FileText,
  CheckCircle,
} from 'lucide-react';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const [activeKey, setActiveKey] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses = [
    { name: 'Master of Professional IT', code: 'MPIT' },
    { name: 'Master of Business', code: 'MB' },
    { name: 'MBA', code: 'MBA' },
    { name: 'BBA', code: 'BBA' },
  ];

  const subjectsByCourse: Record<
    string,
    { code: string; name: string }[]
  > = {
    MPIT: [
      { code: 'CS101', name: 'Database Systems' },
      { code: 'DB502', name: 'Applied IT Ethics' },
      { code: 'SE601', name: 'ICT Project Management' },
      { code: 'SE602', name: 'IT Infrastructure Management' },

    ],
    MB: [
      { code: 'ACC201', name: 'Accounting Principles' },
      { code: 'MKT301', name: 'Marketing Management' },
    ],
    MBA: [
      { code: 'HR401', name: 'Human Resource Management' },
      { code: 'FIN501', name: 'Corporate Finance' },
    ],
    BBA: [
      { code: 'BUS101', name: 'Business Fundamentals' },
      { code: 'ECO201', name: 'Business Economics' },
    ],
  };

  const attendanceData = [
    {
      key: 1,
      date: '2026-01-06',
      subject: 'CS101 - Introduction to Computer Science',
      status: 'Present',
      method: 'QR Scan',
    },
    {
      key: 2,
      date: '2026-01-05',
      subject: 'MATH201 - Calculus II',
      status: 'Present',
      method: 'Wi-Fi Validation',
    },
    {
      key: 3,
      date: '2026-01-04',
      subject: 'PHY301 - Quantum Physics',
      status: 'Absent',
      method: '-',
    },
    {
      key: 4,
      date: '2026-01-03',
      subject: 'CS101 - Introduction to Computer Science',
      status: 'Present',
      method: 'QR Scan',
    },
    {
      key: 5,
      date: '2026-01-02',
      subject: 'ENG401 - Advanced Literature',
      status: 'Present',
      method: 'QR Scan',
    },
  ];

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Present' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    { title: 'Method', dataIndex: 'method', key: 'method' },
  ];

  const overallPercentage = 80;

  const onFinish = (values: any) => {
    console.log('Attendance submitted:', values);
    message.success(
      `Attendance recorded for ${values.subject} (${values.course})`
    );
  };

  const menuItems = [
    { key: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { key: 'take', label: 'Take Attendance', icon: <QrCode className="w-5 h-5" /> },
    { key: 'qr-attendance', label: 'QR Attendance', icon: <QrCode className="w-5 h-5" /> },
    { key: 'history', label: 'Attendance History', icon: <History className="w-5 h-5" /> },
  ];

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header className="bg-gradient-to-r from-indigo-700 to-blue-800 shadow-lg border-b-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <QrCode className="w-10 h-10 text-white" />
            <Title level={3} className="!text-white mb-0 !text-2xl font-bold">
              SmartAttend
            </Title>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={(e) => setActiveKey(e.key)}
            className="bg-transparent border-0 text-lg min-w-0"
          />
        </div>
      </Header>

      <Content className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Home Dashboard */}
        {activeKey === 'home' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-green-500 to-teal-600 text-white border-0 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-white text-5xl font-bold">{overallPercentage}%</Text>
                    <Title level={4} className="text-white mb-0 !text-xl">
                      Overall Attendance
                    </Title>
                  </div>
                  <CheckCircle className="w-20 h-20 opacity-80" />
                </div>
              </Card>

              <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-white text-5xl font-bold">4/5</Text>
                    <Title level={4} className="text-white mb-0 !text-xl">
                      Classes Today
                    </Title>
                  </div>
                  <Users className="w-20 h-20 opacity-80" />
                </div>
              </Card>

              <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-white text-5xl font-bold">12</Text>
                    <Title level={4} className="text-white mb-0 !text-xl">
                      Total Sessions
                    </Title>
                  </div>
                  <FileText className="w-20 h-20 opacity-80" />
                </div>
              </Card>
            </div>

            <Card className="shadow-2xl bg-white/90 backdrop-blur-lg rounded-2xl border-0">
              <Title level={2} className="text-center text-indigo-800 mb-6">
                Welcome to Smart Attendance System
              </Title>
              <Divider className="border-indigo-200" />
              <Text className="text-lg text-gray-700 text-center block mb-8">
                A modern, secure, and efficient way to manage attendance using QR codes and Wi-Fi validation.
              </Text>
            </Card>
          </>
        )}

        {/* QR Attendance Page */}
        {activeKey === 'qr-attendance' && (
          <Card className="max-w-md mx-auto shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl border-0 text-center">
            <div className="p-10">
              <QrCode className="w-32 h-32 text-indigo-600 mx-auto mb-6" />
              <Title level={2} className="text-indigo-800 mb-2">
                QR Attendance
              </Title>
              <Text className="text-gray-600 text-lg">
                Scan the QR code displayed by your instructor to mark your attendance securely.
              </Text>
            </div>
          </Card>
        )}

        {/* Take Attendance Page */}
        {activeKey === 'take' && (
          <Card className="max-w-2xl mx-auto shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl border-0">
            <div className="text-center mb-10">
              <QrCode className="w-24 h-24 text-indigo-600 mx-auto mb-6" />
              <Title level={2} className="text-indigo-800 mb-2">
                Take Attendance
              </Title>
              <Text className="text-gray-600 text-lg">
                Select your course and subject to mark attendance securely
              </Text>
            </div>

            <Form layout="vertical" onFinish={onFinish}>
              {/* Course Select */}
              <Form.Item
                label={<span className="text-lg font-medium">Course</span>}
                name="course"
                rules={[{ required: true, message: 'Please select your course' }]}
              >
                <Select
                  placeholder="Choose your course"
                  size="large"
                  onChange={(value) => setSelectedCourse(value)}
                >
                  {courses.map((c) => (
                    <Select.Option key={c.code} value={c.code}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Subject Select */}
              <Form.Item
                label={<span className="text-lg font-medium">Subject</span>}
                name="subject"
                rules={[{ required: true, message: 'Please select a subject' }]}
              >
                <Select
                  placeholder={selectedCourse ? 'Choose subject' : 'Select course first'}
                  size="large"
                  disabled={!selectedCourse}
                >
                  {selectedCourse &&
                    subjectsByCourse[selectedCourse]?.map((s) => (
                      <Select.Option key={s.code} value={s.code}>
                        {s.code} - {s.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 border-0 rounded-xl shadow-lg"
                >
                  Mark Attendance Now
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* Attendance History */}
        {activeKey === 'history' && (
          <Card className="shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl border-0">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
              <div>
                <Title level={2} className="text-indigo-800 mb-1">
                  Attendance History
                </Title>
                <Text className="text-gray-600 text-lg">View your detailed attendance records</Text>
              </div>
              <div className="text-center">
                <Progress type="circle" percent={overallPercentage} width={100} strokeColor="#6366f1" />
                <Text className="block mt-3 text-lg font-medium">Overall Attendance</Text>
              </div>
            </div>

            <Table
              columns={columns}
              dataSource={attendanceData}
              pagination={{ pageSize: 10 }}
              className="shadow-lg rounded-lg overflow-hidden"
            />
          </Card>
        )}
      </Content>

      <Footer className="text-center bg-gradient-to-r from-indigo-900 to-blue-900 text-white py-10">
        <Text className="text-white text-lg">
          Smart Attendance System ©2026 | Secure • Fast • Reliable
        </Text>
      </Footer>
    </Layout>
  );
}
