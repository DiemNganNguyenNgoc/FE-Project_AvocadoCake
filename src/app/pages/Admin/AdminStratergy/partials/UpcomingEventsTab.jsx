import React from "react";
import { Calendar, Save, Eye } from "lucide-react";
import Button from "../../../../components/AdminLayout/Button";
import Input from "../../../../components/AdminLayout/Input";

/**
 * Tab: Upcoming Events
 * Design: AvocadoCake theme
 */
const UpcomingEventsTab = ({
  upcomingEvents,
  isLoading,
  error,
  daysAhead,
  setDaysAhead,
  onFetch,
  onSave,
  onViewSaved,
}) => {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border-2 border-avocado-brown-30 p-6 shadow-sm">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="number"
              min="7"
              max="365"
              label="Số ngày tới"
              value={daysAhead}
              onChange={(e) => setDaysAhead(Number(e.target.value))}
              placeholder="60"
              disabled={isLoading}
              className="border-2 border-avocado-brown-30 focus:border-avocado-green-100 focus:ring-avocado-green-30"
            />
          </div>
          <Button
            onClick={onFetch}
            disabled={isLoading}
            loading={isLoading}
            icon={<Calendar />}
            // bgColor="avocado-green-100"
            // textColor="avocado-brown-100"
            // hoverBgColor="avocado-green-80"
            // size="md"
            variant="primary"
          >
            {isLoading ? "Đang tải..." : "Lấy sự kiện"}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg px-4 py-3 text-red-700 text-xl font-medium">
          {error}
        </div>
      )}

      {/* Actions */}
      {upcomingEvents.length > 0 && (
        <div className="flex gap-3">
          <Button
            onClick={onSave}
            variant="outline"
            icon={<Save />}
            size="md"
            // className="border-2 border-avocado-green-100 text-avocado-green-100 hover:bg-avocado-green-10"
          >
            Lưu kết quả
          </Button>
          <Button
            onClick={onViewSaved}
            variant="outline"
            icon={<Eye />}
            size="md"
            // className="border-2 border-avocado-brown-100 text-avocado-brown-100 hover:bg-avocado-brown-10"
          >
            Xem đã lưu
          </Button>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-lg border-2 border-avocado-brown-30 overflow-hidden shadow-sm">
        {upcomingEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-avocado-green-10 border-b-2 border-avocado-brown-30">
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Sự kiện
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Ngày diễn ra
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Còn lại
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Mức giảm
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Danh mục mục tiêu
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((e, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-avocado-brown-30 hover:bg-avocado-green-10 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-avocado-brown-100">
                      {e.event_type}
                    </td>
                    <td className="px-6 py-4 text-avocado-brown-50">
                      {e.event_date}
                    </td>
                    <td className="px-6 py-4 text-avocado-brown-50">
                      {e.days_until_event} ngày
                    </td>
                    <td className="px-6 py-4 text-avocado-green-100 font-semibold">
                      {e.recommended_discount_range}
                    </td>
                    <td className="px-6 py-4 text-avocado-brown-50 text-sm">
                      {Array.isArray(e.target_categories)
                        ? e.target_categories.join(", ")
                        : e.target_categories}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-avocado-green-100 mx-auto mb-3" />
            <p className="text-xl text-avocado-brown-50">
              Chưa có sự kiện nào sắp tới.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEventsTab;
