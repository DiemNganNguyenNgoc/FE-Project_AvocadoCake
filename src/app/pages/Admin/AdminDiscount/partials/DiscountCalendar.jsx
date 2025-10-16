import React, { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAdminDiscount } from "../adminDiscountStore";
import AdminButtonComponent from "../../../../components/AdminComponents/AdminButtonComponent";

const getEventColor = (value) => {
  if (value >= 50)
    return { bg: "bg-red-100", border: "border-red-500", text: "text-red-700" };
  if (value >= 30)
    return {
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      text: "text-yellow-700",
    };
  if (value >= 10)
    return {
      bg: "bg-blue-100",
      border: "border-blue-500",
      text: "text-blue-700",
    };
  return {
    bg: "bg-green-100",
    border: "border-green-500",
    text: "text-green-700",
  };
};

const DiscountCalendar = () => {
  const { discounts } = useAdminDiscount();
  const calendarRef = useRef(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const events = useMemo(() => {
    return (discounts || []).map((discount) => {
      const colors = getEventColor(Number(discount.discountValue) || 0);

      // Đảm bảo end date là ngày sau start date
      const startDate = new Date(discount.discountStartDate);
      const endDate = new Date(discount.discountEndDate);

      // Nếu end date giống start date, thêm 1 ngày để hiển thị timeline
      if (startDate.getTime() === endDate.getTime()) {
        endDate.setDate(endDate.getDate() + 1);
      }

      return {
        id: discount._id,
        title: discount.discountName,
        start: startDate.toISOString().split("T")[0], // Format YYYY-MM-DD
        end: endDate.toISOString().split("T")[0], // Format YYYY-MM-DD
        allDay: true,
        backgroundColor: "transparent",
        borderColor: colors.border.replace("border-", ""),
        textColor: colors.text.replace("text-", ""),
        classNames: [
          colors.bg,
          "border-l-4",
          "rounded-md",
          "shadow-sm",
          "hover:shadow-md",
          "transition-shadow",
          "cursor-pointer",
        ],
        extendedProps: {
          discount: discount,
          value: discount.discountValue,
          code: discount.discountCode,
          startDate: discount.discountStartDate,
          endDate: discount.discountEndDate,
        },
      };
    });
  }, [discounts]);

  const handleEventClick = (clickInfo) => {
    setSelectedDiscount(clickInfo.event.extendedProps.discount);
    setShowModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    // Có thể thêm tính năng tạo discount mới ở đây
    console.log("Date selected:", selectInfo);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDiscount(null);
  };

  const viewButtons = [
    { key: "dayGridMonth", label: "Tháng", icon: "📅" },
    { key: "dayGridWeek", label: "Tuần", icon: "📆" },
    { key: "timeGridWeek", label: "Tuần (Giờ)", icon: "�" },
    { key: "dayGridDay", label: "Ngày", icon: "�" },
  ];

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lịch khuyến mãi</h2>
          <p className="text-sm text-gray-600">
            Xem và quản lý khuyến mãi theo thời gian
          </p>
        </div>

        {/* View Controls */}
        <div className="flex gap-2">
          {viewButtons.map((button) => (
            <AdminButtonComponent
              key={button.key}
              variant={currentView === button.key ? "primary" : "outline"}
              size="small"
              onClick={() => {
                setCurrentView(button.key);
                const calendarApi = calendarRef.current?.getApi();
                if (calendarApi) {
                  calendarApi.changeView(button.key);
                }
              }}
              className="text-xs"
            >
              <span className="mr-1">{button.icon}</span>
              {button.label}
            </AdminButtonComponent>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-l-4 border-green-500 bg-green-100"></div>
          <span className="text-sm text-gray-600">Dưới 10%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-l-4 border-blue-500 bg-blue-100"></div>
          <span className="text-sm text-gray-600">10% - 29%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-l-4 border-yellow-500 bg-yellow-100"></div>
          <span className="text-sm text-gray-600">30% - 49%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border-l-4 border-red-500 bg-red-100"></div>
          <span className="text-sm text-gray-600">50% trở lên</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-container rounded-lg border border-gray-200 bg-white">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          events={events}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={3}
          weekends={true}
          eventClick={handleEventClick}
          select={handleDateSelect}
          height="auto"
          eventDisplay="auto"
          eventOverlap={true}
          displayEventTime={false}
          dayHeaderFormat={{ weekday: "short" }}
          titleFormat={{ year: "numeric", month: "long" }}
          locale="vi"
          buttonText={{
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
          }}
          eventContent={(eventInfo) => {
            const event = eventInfo.event;
            const isStart = eventInfo.isStart;
            const isEnd = eventInfo.isEnd;
            const colors = getEventColor(
              Number(event.extendedProps.value) || 0
            );

            return (
              <div
                className={`overflow-hidden text-xs p-1 rounded ${colors.bg} ${colors.border} border-l-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate flex-1">
                    {isStart && "🎯 "}
                    {event.title}
                    {isEnd && " 🏁"}
                  </div>
                  <div
                    className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold ${colors.text}`}
                  >
                    {event.extendedProps.value}%
                  </div>
                </div>
                {(eventInfo.view.type === "dayGridMonth" ||
                  eventInfo.view.type === "dayGridWeek") && (
                  <div className="text-xs opacity-75 mt-1">
                    {isStart &&
                      `Từ ${new Date(event.start).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}`}
                    {isEnd &&
                      !isStart &&
                      `Đến ${new Date(event.end).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}`}
                    {isStart && isEnd && "1 ngày"}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      {/* Modal */}
      {showModal && selectedDiscount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết khuyến mãi
              </h3>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên khuyến mãi
                  </label>
                  <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-900">
                    {selectedDiscount.discountName}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mã khuyến mãi
                    </label>
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-900">
                      {selectedDiscount.discountCode}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Giá trị
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          getEventColor(selectedDiscount.discountValue).bg
                        } ${
                          getEventColor(selectedDiscount.discountValue).text
                        }`}
                      >
                        {selectedDiscount.discountValue}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày bắt đầu
                    </label>
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-900">
                      {new Date(
                        selectedDiscount.discountStartDate
                      ).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày kết thúc
                    </label>
                    <div className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-900">
                      {new Date(
                        selectedDiscount.discountEndDate
                      ).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sản phẩm áp dụng
                  </label>
                  <div className="mt-1 max-h-32 overflow-y-auto rounded-md bg-gray-50 px-3 py-2">
                    {selectedDiscount.discountProduct &&
                    selectedDiscount.discountProduct.length > 0 ? (
                      <div className="space-y-1">
                        {selectedDiscount.discountProduct.map(
                          (product, index) => (
                            <div key={index} className="text-sm text-gray-900">
                              • {product.productName || product}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Không có sản phẩm nào
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex gap-3">
                <AdminButtonComponent
                  variant="primary"
                  onClick={() => {
                    // Logic chuyển sang tab edit
                    closeModal();
                  }}
                  className="flex-1"
                >
                  Chỉnh sửa
                </AdminButtonComponent>
                <AdminButtonComponent variant="outline" onClick={closeModal}>
                  Đóng
                </AdminButtonComponent>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for Calendar */}
      <style jsx>{`
        .calendar-container :global(.fc) {
          font-family: inherit;
        }
        .calendar-container :global(.fc-toolbar-title) {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }
        .calendar-container :global(.fc-button) {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          color: #374151;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
        }
        .calendar-container :global(.fc-button:hover) {
          background: #e5e7eb;
        }
        .calendar-container :global(.fc-button-primary:not(:disabled):active),
        .calendar-container
          :global(.fc-button-primary:not(:disabled).fc-button-active) {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }
        .calendar-container :global(.fc-day-today) {
          background: #eff6ff !important;
        }
        .calendar-container :global(.fc-daygrid-event) {
          border: none !important;
          margin: 1px 0;
          border-radius: 0.375rem;
        }
        .calendar-container :global(.fc-event-title) {
          font-weight: 500;
        }
        .calendar-container :global(.fc-event) {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .calendar-container :global(.fc-event:hover) {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .calendar-container :global(.fc-event-main) {
          padding: 2px 4px;
        }
        .calendar-container :global(.fc-h-event) {
          border: none !important;
          background: transparent !important;
        }
        .calendar-container :global(.fc-daygrid-block-event .fc-event-title) {
          padding: 2px 4px;
        }
        .calendar-container :global(.fc-timegrid-event) {
          border-radius: 0.375rem;
          margin: 1px 0;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default DiscountCalendar;
