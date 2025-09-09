import React, { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import timelinePlugin from "@fullcalendar/timeline";
import { useAdminDiscount } from "../adminDiscountStore";
import DiscountService from "../services/DiscountService";

const colorByValue = (value) => {
  if (value >= 50) return "danger";
  if (value >= 30) return "warning";
  if (value >= 10) return "primary";
  return "success";
};

const DiscountCalendar = () => {
  const { discounts } = useAdminDiscount();
  const calendarRef = useRef(null);
  const [modal, setModal] = useState({ open: false, event: null });

  const events = useMemo(() => {
    return (discounts || []).map((d) => ({
      id: d._id,
      title: `${d.discountName} (${d.discountValue}%)`,
      start: d.discountStartDate,
      end: d.discountEndDate,
      allDay: true,
      extendedProps: { calendar: colorByValue(Number(d.discountValue) || 0) },
    }));
  }, [discounts]);

  const handleEventClick = (clickInfo) => {
    setModal({ open: true, event: clickInfo.event });
  };

  const handleUpdateDiscount = (updatedDiscount) => {
    // Call the DiscountService to update the discount
    DiscountService.updateDiscount(updatedDiscount)
      .then(() => {
        alert("Discount updated successfully!");
        setModal({ open: false, event: null });
      })
      .catch((error) => {
        console.error("Error updating discount:", error);
        alert("Failed to update discount.");
      });
  };

  return (
    <div className="p-4">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            timelinePlugin,
          ]}
          initialView="timelineDay"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timelineDay,timelineWeek,timelineMonth",
          }}
          events={events}
          selectable={true}
          eventClick={handleEventClick}
          eventContent={(info) => {
            const colorClass = `fc-bg-${info.event.extendedProps.calendar}`;
            return (
              <div
                className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
              >
                <div className="fc-daygrid-event-dot"></div>
                <div className="fc-event-time">{info.timeText}</div>
                <div className="fc-event-title">{info.event.title}</div>
              </div>
            );
          }}
        />
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Add / Edit Discount
              </h2>
              <button
                onClick={() => setModal({ open: false, event: null })}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedDiscount = {
                  id: modal.event.id,
                  discountName: e.target.discountName.value,
                  discountValue: e.target.discountValue.value,
                  discountStartDate: e.target.discountStartDate.value,
                  discountEndDate: e.target.discountEndDate.value,
                  discountProduct: e.target.discountProduct.value.split(","),
                };
                handleUpdateDiscount(updatedDiscount);
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Title
                  </label>
                  <input
                    type="text"
                    name="discountName"
                    defaultValue={modal.event.title.split(" (")[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Value (%)
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    defaultValue={modal.event.title.match(/\((\d+)%\)/)?.[1]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="discountStartDate"
                    defaultValue={modal.event.startStr}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="discountEndDate"
                    defaultValue={modal.event.endStr || modal.event.startStr}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Products
                  </label>
                  <input
                    type="text"
                    name="discountProduct"
                    defaultValue={discounts
                      .find((d) => d._id === modal.event.id)
                      ?.discountProduct.map((p) => p.productName)
                      .join(",")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, event: null })}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCalendar;
