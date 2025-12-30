import React, { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAdminDiscount } from "../adminDiscountStore";
import ViewDiscount from "./ViewDiscount";

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

const DiscountCalendar = ({ onEdit }) => {
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

  const handleEdit = () => {
    if (selectedDiscount && onEdit) {
      onEdit(selectedDiscount);
      closeModal();
    }
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
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
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
              className={`rounded-lg px-5 py-2.5 text-lg font-semibold transition-all duration-200 ${
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
        <span className="text-lg font-semibold text-gray-800 dark:text-white">
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
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
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
                    <span className="text-lg font-medium truncate text-gray-900 dark:text-white leading-tight">
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

      {/* Use ViewDiscount Modal */}
      {showModal && selectedDiscount && (
        <ViewDiscount
          discountId={selectedDiscount._id}
          onClose={closeModal}
          onEdit={handleEdit}
        />
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
