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
    <div className="rounded-2xl bg-white dark:bg-gray-dark p-8 shadow-[0_2px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
      {/* Header - Gestalt: Proximity + Simplicity */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lịch khuyến mãi
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Quản lý chương trình khuyến mãi theo thời gian
          </p>
        </div>

        {/* View Controls - Gestalt: Similarity with Avocado theme */}
        <div className="inline-flex rounded-xl bg-avocado-green-10 dark:bg-dark-2 p-1.5 border border-avocado-green-30 dark:border-stroke-dark">
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
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                currentView === button.key
                  ? "bg-avocado-green-100 text-white shadow-md scale-105"
                  : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-dark-3"
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend - Gestalt: Figure-Ground + Similarity with modern badges */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 dark:border-stroke-dark bg-gradient-to-r from-gray-50 to-white dark:from-dark-2 dark:to-gray-dark px-6 py-4">
        <span className="text-sm font-semibold text-gray-800 dark:text-white">
          Phân loại giá trị:
        </span>
        {[
          { label: "< 10%", colors: getEventColor(5) },
          { label: "10-29%", colors: getEventColor(20) },
          { label: "30-49%", colors: getEventColor(40) },
          { label: "≥ 50%", colors: getEventColor(50) },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-dark border border-gray-200 dark:border-stroke-dark hover:border-avocado-green-50 transition-colors"
          >
            <div
              className={`h-3 w-3 rounded-full ${
                item.colors.dot
              } ring-2 ring-offset-1 ring-${item.colors.dot.replace(
                "bg-",
                ""
              )}/30`}
            ></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar - Gestalt: Continuity with modern styling */}
      <div className="calendar-container rounded-2xl border-2 border-gray-100 dark:border-stroke-dark bg-white dark:bg-gray-dark overflow-hidden shadow-inner">
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

            return (
              <div
                className={`group relative overflow-hidden px-3 py-3 rounded-md ${colors.bg} dark:bg-opacity-20 border-l-4 ${colors.border} shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate text-gray-900 dark:text-white leading-tight">
                      {event.title}
                    </span>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold ${colors.text} bg-white dark:bg-gray-800`}
                  >
                    -{event.extendedProps.value}%
                  </span>
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Modal - Gestalt: Figure-Ground with modern animations */}
      {showModal && selectedDiscount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-dark shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.01]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with gradient */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-stroke-dark px-6 py-5 bg-gradient-to-r from-avocado-green-10 to-white dark:from-dark-2 dark:to-gray-dark rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-full ${
                    getEventColor(selectedDiscount.discountValue).bg
                  } dark:bg-opacity-20 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110`}
                >
                  <span
                    className={`text-lg font-bold ${
                      getEventColor(selectedDiscount.discountValue).text
                    } dark:text-white`}
                  >
                    {selectedDiscount.discountValue}%
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Chi tiết khuyến mãi
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="rounded-xl p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-3 hover:text-gray-600 dark:hover:text-white transition-all duration-200 hover:rotate-90"
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

            {/* Modal Content - Gestalt: Proximity with modern cards */}
            <div className="px-6 py-6 space-y-6">
              {/* Name with icon */}
              <div className="group">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Tên chương trình
                </label>
                <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white group-hover:text-avocado-green-100 transition-colors">
                  {selectedDiscount.discountName}
                </p>
              </div>

              {/* Code & Value - Gestalt: Similarity with enhanced styling */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Mã khuyến mãi
                  </label>
                  <p className="mt-2 font-mono text-sm font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-3 dark:to-dark-2 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-stroke-dark group-hover:border-avocado-green-50 transition-all duration-200 shadow-sm">
                    {selectedDiscount.discountCode}
                  </p>
                </div>
                <div className="group">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Giá trị
                  </label>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold border-2 shadow-lg transform transition-all duration-200 group-hover:scale-105 ${
                        getEventColor(selectedDiscount.discountValue).bg
                      } dark:bg-opacity-20 ${
                        getEventColor(selectedDiscount.discountValue).text
                      } dark:text-white ${
                        getEventColor(selectedDiscount.discountValue).border
                      } dark:border-opacity-50`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {selectedDiscount.discountValue}% OFF
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates with timeline style */}
              <div className="relative bg-gradient-to-r from-avocado-green-10 to-white dark:from-dark-3 dark:to-gray-dark rounded-xl p-5 border-2 border-avocado-green-30 dark:border-stroke-dark">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-avocado-green-50 dark:bg-avocado-green-30 transform -translate-x-1/2"></div>
                <div className="grid grid-cols-2 gap-6 relative">
                  <div className="group">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-avocado-green-100"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Bắt đầu
                    </label>
                    <p className="mt-2 text-base font-bold text-gray-900 dark:text-white group-hover:text-avocado-green-100 transition-colors">
                      {new Date(
                        selectedDiscount.discountStartDate
                      ).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="group">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Kết thúc
                    </label>
                    <p className="mt-2 text-base font-bold text-gray-900 dark:text-white group-hover:text-red-500 transition-colors">
                      {new Date(
                        selectedDiscount.discountEndDate
                      ).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products with enhanced styling */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Sản phẩm áp dụng
                  <span className="ml-auto px-2.5 py-1 rounded-full bg-avocado-green-100 text-white text-xs font-bold">
                    {selectedDiscount.discountProduct?.length || 0}
                  </span>
                </label>
                <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border-2 border-gray-200 dark:border-stroke-dark bg-gradient-to-b from-gray-50 to-white dark:from-dark-3 dark:to-gray-dark shadow-inner">
                  {selectedDiscount.discountProduct &&
                  selectedDiscount.discountProduct.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-stroke-dark">
                      {selectedDiscount.discountProduct.map(
                        (product, index) => (
                          <div
                            key={index}
                            className="group px-5 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-avocado-green-10 dark:hover:bg-dark-2 hover:text-avocado-green-100 transition-all duration-200 flex items-center gap-3"
                          >
                            <div className="w-2 h-2 rounded-full bg-avocado-green-100 group-hover:scale-150 transition-transform"></div>
                            <span className="flex-1">
                              {product.productName || product}
                            </span>
                            <svg
                              className="w-4 h-4 text-gray-400 group-hover:text-avocado-green-100 transform group-hover:translate-x-1 transition-all"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="px-5 py-12 text-center">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Không có sản phẩm nào
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer with gradient */}
            <div className="border-t border-gray-200 dark:border-stroke-dark px-6 py-5 bg-gradient-to-r from-gray-50 to-white dark:from-dark-2 dark:to-gray-dark rounded-b-2xl">
              <div className="flex gap-3">
                <AdminButtonComponent
                  variant="primary"
                  onClick={closeModal}
                  className="flex-1 shadow-lg hover:shadow-xl transition-shadow text-white"
                >
                  Chỉnh sửa
                </AdminButtonComponent>
                <AdminButtonComponent
                  variant="outline"
                  onClick={closeModal}
                  className="hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                >
                  Đóng
                </AdminButtonComponent>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS - Enhanced Modern & Avocado theme */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .calendar-container :global(.fc) {
          font-family: inherit;
        }
        .calendar-container :global(.fc-toolbar-title) {
          font-size: 1.375rem;
          font-weight: 600;
          color: #111827;
          letter-spacing: -0.015em;
        }
        .calendar-container :global(.fc-button) {
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          border: 2px solid #d1d5db;
          color: #4b5563;
          border-radius: 0.75rem;
          padding: 0.625rem 1.25rem;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .calendar-container :global(.fc-button:hover) {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-color: #9ca3af;
          color: #1f2937;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .calendar-container :global(.fc-button-primary:not(:disabled):active),
        .calendar-container
          :global(.fc-button-primary:not(:disabled).fc-button-active) {
          background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
          border-color: #9ca3af;
          color: #111827;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          transform: translateY(0);
        }
        .calendar-container :global(.fc-day-today) {
          background: #f0f9ff !important;
          position: relative;
        }
        .calendar-container :global(.fc-day-today .fc-daygrid-day-number) {
          background: #0ea5e9;
          color: white;
          border-radius: 9999px;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0.25rem;
          font-weight: 600;
        }
        .calendar-container :global(.fc-daygrid-event) {
          border: none !important;
          margin: 4px 3px;
        }
        .calendar-container :global(.fc-event) {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .calendar-container :global(.fc-event:hover) {
          z-index: 10;
        }
        .calendar-container :global(.fc-h-event) {
          border: none !important;
          background: transparent !important;
        }
        .calendar-container :global(.fc-col-header-cell) {
          padding: 1rem 0;
          font-weight: 500;
          color: #6b7280;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: transparent;
          border-bottom: 1px solid #e5e7eb;
        }
        .calendar-container :global(.fc-daygrid-day-number) {
          padding: 0.5rem;
          font-weight: 400;
          color: #374151;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .calendar-container :global(.fc-daygrid-day-number:hover) {
          color: #0ea5e9;
        }
        .calendar-container :global(.fc-daygrid-day-frame) {
          min-height: 120px;
          transition: all 0.2s ease;
        }
        .calendar-container :global(.fc-daygrid-day-frame:hover) {
          background: #f9fafb;
        }
        .calendar-container :global(.fc-daygrid-event-harness) {
          margin-bottom: 3px !important;
        }
        .calendar-container :global(.fc-daygrid-event) {
          min-width: calc(100% + 100px) !important;
        }
        .calendar-container :global(.fc-scrollgrid) {
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .calendar-container :global(.fc-scrollgrid-section-body td) {
          border-color: #e5e7eb;
        }
        .calendar-container :global(.fc-daygrid-day) {
          transition: background-color 0.15s ease;
        }
        /* Dark mode support */
        :global(.dark) .calendar-container :global(.fc-toolbar-title) {
          color: #f9fafb;
        }
        :global(.dark) .calendar-container :global(.fc-button) {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          border-color: #4b5563;
          color: #d1d5db;
        }
        :global(.dark) .calendar-container :global(.fc-button:hover) {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          border-color: #6b7280;
          color: #f3f4f6;
        }
        :global(.dark)
          .calendar-container
          :global(.fc-button-primary:not(:disabled):active),
        :global(.dark)
          .calendar-container
          :global(.fc-button-primary:not(:disabled).fc-button-active) {
          background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
          border-color: #6b7280;
        }
        :global(.dark) .calendar-container :global(.fc-col-header-cell) {
          background: transparent;
          color: #9ca3af;
          border-bottom-color: #374151;
        }
        :global(.dark) .calendar-container :global(.fc-daygrid-day-number) {
          color: #d1d5db;
        }
        :global(.dark) .calendar-container :global(.fc-day-today) {
          background: #1e3a5f !important;
        }
        :global(.dark)
          .calendar-container
          :global(.fc-day-today .fc-daygrid-day-number) {
          background: #0ea5e9;
        }
        :global(.dark) .calendar-container :global(.fc-scrollgrid) {
          border-color: #374151;
        }
        :global(.dark)
          .calendar-container
          :global(.fc-scrollgrid-section-body td) {
          border-color: #374151;
        }
        :global(.dark)
          .calendar-container
          :global(.fc-daygrid-day-frame:hover) {
          background: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default DiscountCalendar;
