'use client';

import { useState, useEffect, useRef } from 'react';
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
  message,
} from 'antd';
import {
  QrCode,
  History,
  Home,
  Users,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface AttendanceEntry {
  key: number;
  date: string;
  subject: string;
  status: 'Present' | 'Absent';
  method: string;
}

export default function App() {
  const [activeKey, setActiveKey] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([
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
  ]);

  // Scanner state
  const [scanResult, setScanResult] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const courses = [
    { name: 'Master of Professional IT', code: 'MPIT' },
    { name: 'Master of Business', code: 'MB' },
    { name: 'MBA', code: 'MBA' },
    { name: 'BBA', code: 'BBA' },
  ];

  const subjectsByCourse: Record<string, { code: string; name: string }[]> = {
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

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: AttendanceEntry, b: AttendanceEntry) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Present' | 'Absent') => (
        <Tag color={status === 'Present' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    { title: 'Method', dataIndex: 'method', key: 'method' },
  ];

  const overallPercentage = attendanceData.length
    ? Math.round(
        (attendanceData.filter((a) => a.status === 'Present').length /
          attendanceData.length) *
          100
      )
    : 0;

  const menuItems = [
    { key: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { key: 'take', label: 'Take Attendance', icon: <QrCode className="w-5 h-5" /> },
    { key: 'qr-attendance', label: 'QR Attendance', icon: <QrCode className="w-5 h-5" /> },
    { key: 'history', label: 'Attendance History', icon: <History className="w-5 h-5" /> },
    { key: 'scan-qr', label: 'Scan QR Code', icon: <QrCode className="w-5 h-5" /> },
  ];

  const qrValue =
    selectedCourse && selectedSubject
      ? JSON.stringify({
          course: selectedCourse,
          subject: selectedSubject,
          timestamp: Date.now(),
        })
      : '';

  const handleSubmitAttendance = () => {
    if (!selectedCourse || !selectedSubject) {
      message.error('Please select course and subject');
      return;
    }
    const newEntry: AttendanceEntry = {
      key: attendanceData.length + 1,
      date: new Date().toISOString().split('T')[0],
      subject: `${selectedSubject} (${selectedCourse})`,
      status: 'Present',
      method: 'Manual',
    };
    setAttendanceData([newEntry, ...attendanceData]);
    message.success('Attendance submitted successfully!');
  };

  // QR Scanner Logic
  useEffect(() => {
    if (activeKey !== 'scan-qr') return;

    const onScanSuccess = (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText);
        if (!data.course || !data.subject) {
          message.error('Invalid QR code: missing course or subject');
          return;
        }

        const fullSubjectName =
          subjectsByCourse[data.course]?.find((s) => s.code === data.subject)
            ?.name || data.subject;

        const newEntry: AttendanceEntry = {
          key: attendanceData.length + 1,
          date: new Date().toISOString().split('T')[0],
          subject: `${data.subject} - ${fullSubjectName} (${data.course})`,
          status: 'Present',
          method: 'QR Scan',
        };

        setAttendanceData([newEntry, ...attendanceData]);
        setScanResult('success');
        message.success(`Attendance marked for ${data.subject}! ✅`);

        // Stop scanner after successful scan
        scannerRef.current?.pause();
      } catch (err) {
        message.error('Invalid QR code format');
      }
    };

    const onScanError = (err: string) => {
      // Suppress noisy errors
      console.warn(err);
    };

    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 300, height: 300 },
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        aspectRatio: 1,
      },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanError);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.warn('Failed to clear scanner', error);
        });
      }
    };
  }, [activeKey, attendanceData]);

  const handleRescan = () => {
    setScanResult(null);
    scannerRef.current?.resume();
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header className="bg-gradient-to-r from-indigo-700 to-blue-800 shadow-lg border-b-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <div className="flex items-center space-x-4"
          onClick={()=>setActiveKey('home')} style={{cursor: 'pointer'}}
          >
            <QrCode className="w-10 h-10 text-white" />
            <Title level={3} className="!text-white mt-3 mb-0 !text-2xl font-bold">
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
        {/* Home Section */}
        {activeKey === 'home' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-green-500 to-teal-600 text-white border-0 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="text-white text-5xl font-bold">
                      {overallPercentage}%
                    </Text>
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
                    <Text className="text-white text-5xl font-bold">
                      {attendanceData.length}
                    </Text>
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
                A modern, secure, and efficient way to manage attendance using QR
                codes and Wi-Fi validation.
              </Text>
            </Card>
          </>
        )}

        {/* Scan QR Code Section */}
        {activeKey === 'scan-qr' && (
          <Card className="max-w-2xl mx-auto shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl border-0 p-8">
            <Title level={2} className="text-center text-indigo-800 mb-6">
              Scan QR Code for Attendance
            </Title>

            {!scanResult ? (
              <>
                <div
                  id="qr-reader"
                  className="mx-auto w-full max-w-md rounded-lg overflow-hidden shadow-inner"
                  style={{ aspectRatio: '1 / 1' }}
                />
                <Text className="block text-center text-gray-600 mt-6 text-lg">
                  Position the QR code within the frame
                </Text>
              </>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
                <Title level={3} className="text-green-700">
                  Attendance Marked Successfully! ✅
                </Title>
                <Button
                  type="primary"
                  size="large"
                  className="mt-8"
                  onClick={handleRescan}
                >
                  Scan Another QR Code
                </Button>
              </div>
            )}
          </Card>
        )}

        {activeKey === 'qr-attendance' && (
          <Card className="max-w-2xl mx-auto shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl border-0 p-6">
            <Title level={2} className="text-indigo-800 mb-2 text-center">
              Generate QR for Attendance
            </Title>
            <div className="mb-6 flex justify-center">
              {qrValue ? (
                <QRCodeCanvas value={qrValue} size={200} level="H" />
              ) : (
                <QrCode className="w-32 h-32 text-indigo-600 mx-auto" />
              )}
            </div>
            <Form layout="vertical">
              <Form.Item label="Course">
                <Select
                  placeholder="Choose your course"
                  size="large"
                  onChange={(value) => {
                    setSelectedCourse(value);
                    setSelectedSubject(null);
                  }}
                >
                  {courses.map((c) => (
                    <Select.Option key={c.code} value={c.code}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Subject">
                <Select
                  placeholder={
                    selectedCourse ? 'Choose subject' : 'Select course first'
                  }
                  size="large"
                  disabled={!selectedCourse}
                  onChange={(value) => setSelectedSubject(value)}
                >
                  {selectedCourse &&
                    subjectsByCourse[selectedCourse]?.map((s) => (
                      <Select.Option key={s.code} value={s.code}>
                        {s.code} - {s.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              {qrValue && (
                <div className="mt-4 text-center">
                  <Text strong className="text-green-600">
                    QR Generated Successfully ✅
                  </Text>
                </div>
              )}
            </Form>
          </Card>
        )}

        {activeKey === 'take' && (
          <Card className="max-w-2xl mx-auto shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl border-0 p-6">
            <Title level={2} className="text-indigo-800 mb-2 text-center">
              Manual Attendance
            </Title>
            <Form layout="vertical">
              <Form.Item label="Course">
                <Select
                  placeholder="Choose your course"
                  size="large"
                  onChange={(value) => {
                    setSelectedCourse(value);
                    setSelectedSubject(null);
                  }}
                >
                  {courses.map((c) => (
                    <Select.Option key={c.code} value={c.code}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Subject">
                <Select
                  placeholder={
                    selectedCourse ? 'Choose subject' : 'Select course first'
                  }
                  size="large"
                  disabled={!selectedCourse}
                  onChange={(value) => setSelectedSubject(value)}
                >
                  {selectedCourse &&
                    subjectsByCourse[selectedCourse]?.map((s) => (
                      <Select.Option key={s.code} value={s.code}>
                        {s.code} - {s.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <div className="flex justify-center">
                <Button type="primary" size="large" onClick={handleSubmitAttendance}>
                  Mark Present
                </Button>
              </div>
            </Form>
          </Card>
        )}

        {activeKey === 'history' && (
          <Card className="shadow-2xl bg-white/95 backdrop-blur-lg rounded-2xl border-0 p-6">
            <Title level={2} className="text-indigo-800 mb-4">
              Attendance History
            </Title>
            <Table
              columns={columns}
              dataSource={attendanceData}
              pagination={{ pageSize: 10 }}
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