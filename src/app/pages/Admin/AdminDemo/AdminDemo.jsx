import React, { useState } from "react";
import {
  StatCard,
  ChartCard,
  DataTable,
  Button,
  Modal,
  Input,
  Checkbox,
} from "../../../components/AdminLayout";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import UpdateModalExample from "../../../components/AdminLayout/UpdateModalExample";
import UpdateModal from "../../../components/AdminLayout/UpdateModal";

const AdminDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for charts
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(87, 80, 241, 0.8)",
        borderColor: "rgba(87, 80, 241, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Desktop", "Mobile", "Tablet"],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: [
          "rgba(87, 80, 241, 0.8)",
          "rgba(34, 173, 92, 0.8)",
          "rgba(255, 99, 132, 0.8)",
        ],
        borderColor: [
          "rgba(87, 80, 241, 1)",
          "rgba(34, 173, 92, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample data for table
  const tableData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Moderator",
      status: "Active",
    },
  ];

  const tableColumns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "role",
      header: "Role",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Admin"
              ? "bg-red-100 text-red-800"
              : value === "Moderator"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            icon={<Eye className="w-4 h-4" />}
          />
          <Button
            size="sm"
            variant="ghost"
            icon={<Edit className="w-4 h-4" />}
          />
          <Button
            size="sm"
            variant="ghost"
            icon={<Trash2 className="w-4 h-4" />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-dark dark:text-white">
          Admin UI Demo
        </h1>
        <p className="text-dark-4 dark:text-dark-6 mt-1 text-base font-outfit">
          Demo các component UI hiện đại cho trang admin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="1,234"
          change={12.5}
          icon={<div className="w-6 h-6 text-white">👥</div>}
          color="bg-blue-500"
          progress={75}
        />
        <StatCard
          title="Revenue"
          value="$45,678"
          change={-2.3}
          icon={<div className="w-6 h-6 text-white">💰</div>}
          color="bg-green-500"
          progress={60}
        />
        <StatCard
          title="Orders"
          value="567"
          change={8.1}
          icon={<div className="w-6 h-6 text-white">📦</div>}
          color="bg-purple-500"
          progress={90}
        />
        <StatCard
          title="Products"
          value="89"
          change={0}
          icon={<div className="w-6 h-6 text-white">🛍️</div>}
          color="bg-orange-500"
          hideProgress
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Sales Overview">
          <Bar
            data={barData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </ChartCard>
        <ChartCard title="Device Usage">
          <Pie
            data={pieData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </ChartCard>
      </div>

      {/* Buttons Demo */}
      <div className="bg-white dark:bg-gray-dark rounded-lg border border-stroke dark:border-stroke-dark p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Buttons
        </h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={tableColumns}
        data={tableData}
        onSearch={setSearchTerm}
        onFilter={() => console.log("Filter clicked")}
        onExport={() => console.log("Export clicked")}
        showSearch
        showFilter
        showExport
        searchPlaceholder="Search users..."
      />

      {/* Modal Demo */}
      <div className="bg-white dark:bg-gray-dark rounded-lg border border-stroke dark:border-stroke-dark p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Modal
        </h3>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
      </div>

      {/* Form Demo */}
      <div className="bg-white dark:bg-gray-dark rounded-lg border border-stroke dark:border-stroke-dark p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">
          Form Elements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            placeholder="Enter your name"
            helperText="This is a helper text"
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error="This field is required"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
          <Input
            label="Search"
            placeholder="Search..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Demo Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is a demo modal with modern styling.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Modal>

      {/* update modal */}

      <UpdateModalExample />
      <Checkbox label="I agree to the terms and conditions" />
    </div>
  );
};

export default AdminDemo;
