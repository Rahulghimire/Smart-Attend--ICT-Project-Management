'use client';

import { useState } from 'react';
import { Layout, Menu, Card, Table, Form, Select, Button, Typography, Divider, Tag, Progress } from 'antd';
import { QrCode, History, Home, Users, Bell, FileText, CheckCircle } from 'lucide-react';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const [activeKey, setActiveKey] = useState('home');

  const subjects = [
    { code: 'CS101', name: 'Introduction to Computer Science' },
    { code: 'MATH201', name: 'Calculus II' },
    { code: 'PHY301', name: 'Quantum Physics' },
    { code: 'ENG401', name: 'Advanced Literature' },
  ];

  const courses = ['B.Tech Computer Science', 'M.Sc Physics', 'MBA', 'B.A English'];

  const attendanceData = [
    { key: 1, date: '2026-01-06', subject: 'CS101 - Introduction to Computer Science', status: 'Present', method: 'QR Scan' },
    { key: 2, date: '2026-01-05', subject: 'MATH201 - Calculus II', status: 'Present', method: 'Wi-Fi Validation' },
    { key: 3, date: '2026-01-04', subject: 'PHY301 - Quantum Physics', status: 'Absent', method: '-' },
    { key: 4, date: '2026-01-03', subject: 'CS101 - Introduction to Computer Science', status: 'Present', method: 'QR Scan' },
    { key: 5, date: '2026-01-02', subject: 'ENG401 - Advanced Literature', status: 'Present', method: 'QR Scan' },
  ];

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', sorter: (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime() },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Present' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    { title: 'Method', dataIndex: 'method', key: 'method' },
  ];

  const overallPercentage = 80;

  const onFinish = (values: any) => {
    console.log('Attendance submitted:', values);
    // In a real app, submit to backend here
  };

  const menuItems = [
    { key: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { key: 'take', label: 'Take Attendance', icon: <QrCode className="w-5 h-5" /> },
    { key: 'history', label: 'Attendance History', icon: <History className="w-5 h-5" /> },
  ];

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header className="bg-gradient-to-r from-indigo-700 to-blue-800 shadow-lg border-b-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <QrCode className="w-10 h-10 text-white" />
            <Title level={3} className="text-white mb-0 !text-2xl font-bold">SmartAttend</Title>
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
        {activeKey === 'home' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-green-500 to-teal-600 text-white border-0 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-white text-5xl font-bold">{overallPercentage}%</Text>
                    <Title level={4} className="text-white mb-0 !text-xl">Overall Attendance</Title>
                  </div>
                  <CheckCircle className="w-20 h-20 opacity-80" />
                </div>
              </Card>

              <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-white text-5xl font-bold">4/5</Text>
                    <Title level={4} className="text-white mb-0 !text-xl">Classes Today</Title>
                  </div>
                  <Users className="w-20 h-20 opacity-80" />
                </div>
              </Card>

              <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-white text-5xl font-bold">12</Text>
                    <Title level={4} className="text-white mb-0 !text-xl">Total Sessions</Title>
                  </div>
                  <FileText className="w-20 h-20 opacity-80" />
                </div>
              </Card>
            </div>

            <Card className="shadow-2xl bg-white/90 backdrop-blur-lg rounded-2xl border-0">
              <Title level={2} className="text-center text-indigo-800 mb-6">Welcome to Smart Attendance System</Title>
              <Divider className="border-indigo-200" />
              <Text className="text-lg text-gray-700 text-center block mb-8">
                A modern, secure, and efficient way to manage attendance using QR codes and Wi-Fi validation.
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-10 h-10 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <Title level={4} className="text-indigo-700">Secure & Proxy-Proof</Title>
                    <Text className="text-gray-600">Wi-Fi presence + QR scanning prevents proxy attendance.</Text>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Bell className="w-10 h-10 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <Title level={4} className="text-indigo-700">Real-time Notifications</Title>
                    <Text className="text-gray-600">Get instant updates on check-ins and reports.</Text>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeKey === 'take' && (
          <Card className="max-w-2xl mx-auto shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl border-0">
            <div className="text-center mb-10">
              <QrCode className="w-24 h-24 text-indigo-600 mx-auto mb-6" />
              <Title level={2} className="text-indigo-800 mb-2">Take Attendance</Title>
              <Text className="text-gray-600 text-lg">Select your course and subject to mark attendance securely</Text>
            </div>

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label={<span className="text-lg font-medium">Course</span>} name="course" rules={[{ required: true, message: 'Please select your course' }]}>
                <Select placeholder="Choose your course" size="large" className="rounded-lg">
                  {courses.map((c) => (
                    <Select.Option key={c} value={c}>{c}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label={<span className="text-lg font-medium">Subject</span>} name="subject" rules={[{ required: true, message: 'Please select a subject' }]}>
                <Select placeholder="Choose subject" size="large" className="rounded-lg">
                  {subjects.map((s) => (
                    <Select.Option key={s.code} value={s.code}>
                      {s.code} - {s.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block className="h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 border-0 rounded-xl shadow-lg">
                  Mark Attendance Now
                </Button>
              </Form.Item>
            </Form>

            <Divider className="text-indigo-600">Security Features</Divider>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-6 bg-green-50 rounded-xl">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <Text strong className="block text-green-800">Wi-Fi Verified</Text>
                <Text className="text-sm text-gray-600">Only on campus network</Text>
              </div>
              <div className="p-6 bg-blue-50 rounded-xl">
                <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <Text strong className="block text-blue-800">Instant QR Scan</Text>
                <Text className="text-sm text-gray-600">No duplicates allowed</Text>
              </div>
            </div>
          </Card>
        )}

        {activeKey === 'history' && (
          <Card className="shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl border-0">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
              <div>
                <Title level={2} className="text-indigo-800 mb-1">Attendance History</Title>
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
        <Text className="text-white text-lg">Smart Attendance System ©2026 | Secure • Fast • Reliable</Text>
      </Footer>
    </Layout>
  );
}