import React, { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAdminDiscount } from "../adminDiscountStore";
import AdminButtonComponent from "../../../../components/AdminComponents/AdminButtonComponent";

const getEventColor = (value) => {
  if (value >= 50)
    return {
      bg: "bg-red-50",
      border: "border-red-400",
      text: "text-red-700",
      dot: "bg-red-400",
    };
  if (value >= 30)
    return {
      bg: "bg-amber-50",
      border: "border-amber-400",
      text: "text-amber-700",
      dot: "bg-amber-400",
    };
  if (value >= 10)
    return {
      bg: "bg-blue-50",
      border: "border-blue-400",
      text: "text-blue-700",
      dot: "bg-blue-400",
    };
  return {
    bg: "bg-emerald-50",
    border: "border-emerald-400",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
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

      const startDate = new Date(discount.discountStartDate);
      const endDate = new Date(discount.discountEndDate);

      // FIX: FullCalendar's end date is EXCLUSIVE
      // Add 1 day to make the end date inclusive
      const calendarEndDate = new Date(endDate);
      calendarEndDate.setDate(calendarEndDate.getDate() + 1);

      return {
        id: discount._id,
        title: discount.discountName,
        start: startDate.toISOString().split("T")[0],
        end: calendarEndDate.toISOString().split("T")[0], // Now inclusive
        allDay: true,
        backgroundColor: "transparent",
        borderColor: colors.border.replace("border-", ""),
        textColor: colors.text.replace("text-", ""),
        classNames: [colors.bg, "border-l-4", "rounded", "cursor-pointer"],
        extendedProps: {
          discount: discount,
          value: discount.discountValue,
          code: discount.discountCode,
          startDate: discount.discountStartDate,
          endDate: discount.discountEndDate,
          colors: colors,
        },
      };
    });
  }, [discounts]);

  const handleEventClick = (clickInfo) => {
    setSelectedDiscount(clickInfo.event.extendedProps.discount);
    setShowModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    console.log("Date selected:", selectInfo);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDiscount(null);
  };

  const viewButtons = [
    { key: "dayGridMonth", label: "Tháng" },
    { key: "dayGridWeek", label: "Tuần" },
    { key: "dayGridDay", label: "Ngày" },
  ];

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      {/* Header - Gestalt: Proximity + Simplicity */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Lịch khuyến mãi
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý chương trình khuyến mãi
          </p>
        </div>

        {/* View Controls - Gestalt: Similarity */}
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          {viewButtons.map((button) => (
            <button
              key={button.key}
              onClick={() => {
                setCurrentView(button.key);
                const calendarApi = calendarRef.current?.getApi();
                if (calendarApi) {
                  calendarApi.changeView(button.key);
                }
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                currentView === button.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend - Gestalt: Figure-Ground + Similarity */}
      <div className="mb-6 flex items-center gap-6 rounded-lg border border-gray-200 bg-gray-50 px-6 py-3">
        <span className="text-sm font-medium text-gray-700">Giá trị:</span>
        {[
          { label: "< 10%", colors: getEventColor(5) },
          { label: "10-29%", colors: getEventColor(20) },
          { label: "30-49%", colors: getEventColor(40) },
          { label: "≥ 50%", colors: getEventColor(50) },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${item.colors.dot}`}
            ></div>
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar - Gestalt: Continuity */}
      <div className="calendar-container rounded-lg border border-gray-200 bg-white overflow-hidden">
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
            const colors = event.extendedProps.colors;
            const isStart = eventInfo.isStart;
            const isEnd = eventInfo.isEnd;

            return (
              <div
                className={`group overflow-hidden text-xs px-2 py-1.5 rounded ${colors.bg} ${colors.border} border-l-4 hover:shadow-md transition-all`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate flex-1 text-gray-900">
                    {event.title}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-semibold ${colors.text} bg-white/80`}
                  >
                    {event.extendedProps.value}%
                  </span>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Modal - Gestalt: Figure-Ground */}
      {showModal && selectedDiscount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-5">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full ${
                    getEventColor(selectedDiscount.discountValue).bg
                  } flex items-center justify-center`}
                >
                  <span
                    className={`text-lg font-bold ${
                      getEventColor(selectedDiscount.discountValue).text
                    }`}
                  >
                    {selectedDiscount.discountValue}%
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết khuyến mãi
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
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

            {/* Modal Content - Gestalt: Proximity */}
            <div className="px-6 py-6 space-y-5">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tên chương trình
                </label>
                <p className="mt-1.5 text-base font-medium text-gray-900">
                  {selectedDiscount.discountName}
                </p>
              </div>

              {/* Code & Value - Gestalt: Similarity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Mã khuyến mãi
                  </label>
                  <p className="mt-1.5 font-mono text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {selectedDiscount.discountCode}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Giá trị
                  </label>
                  <div className="mt-1.5">
                    <span
                      className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-bold ${
                        getEventColor(selectedDiscount.discountValue).bg
                      } ${getEventColor(selectedDiscount.discountValue).text}`}
                    >
                      {selectedDiscount.discountValue}% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Bắt đầu
                  </label>
                  <p className="mt-1.5 text-sm text-gray-900">
                    {new Date(
                      selectedDiscount.discountStartDate
                    ).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Kết thúc
                  </label>
                  <p className="mt-1.5 text-sm text-gray-900">
                    {new Date(
                      selectedDiscount.discountEndDate
                    ).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Sản phẩm ({selectedDiscount.discountProduct?.length || 0})
                </label>
                <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                  {selectedDiscount.discountProduct &&
                  selectedDiscount.discountProduct.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {selectedDiscount.discountProduct.map(
                        (product, index) => (
                          <div
                            key={index}
                            className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {product.productName || product}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      Không có sản phẩm
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <AdminButtonComponent
                  variant="primary"
                  onClick={closeModal}
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

      {/* Custom CSS */}
      <style jsx>{`
        .calendar-container :global(.fc) {
          font-family: inherit;
        }
        .calendar-container :global(.fc-toolbar-title) {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }
        .calendar-container :global(.fc-button) {
          background: white;
          border: 1px solid #e5e7eb;
          color: #374151;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .calendar-container :global(.fc-button:hover) {
          background: #f9fafb;
          border-color: #d1d5db;
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
          margin: 2px 0;
        }
        .calendar-container :global(.fc-event) {
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .calendar-container :global(.fc-event:hover) {
          transform: translateY(-1px);
        }
        .calendar-container :global(.fc-h-event) {
          border: none !important;
          background: transparent !important;
        }
        .calendar-container :global(.fc-col-header-cell) {
          padding: 12px 0;
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
        }
        .calendar-container :global(.fc-daygrid-day-number) {
          padding: 8px;
          font-weight: 500;
          color: #374151;
        }
      `}</style>
    </div>
  );
};

export default DiscountCalendar;
