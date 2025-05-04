import React from "react";

const EventItem = ({ iconClass, title, time, className = "" }) => (
  <div className={`bg-gray-50 rounded-2xl p-4 ${className}`}>
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-11 h-11 bg-white rounded-xl text-2xl">
          <i className={iconClass}></i>
        </span>
        <div>
          <h6 className="mb-1 font-medium text-sm text-gray-800">{title}</h6>
          <span className="text-sm text-gray-500">{time}</span>
        </div>
      </div>
      <div className="relative group">
        <button className="text-gray-400 text-xl">
          <i className="bi bi-three-dots-vertical"></i>
        </button>
        <div className="hidden group-hover:block absolute right-0 mt-2 z-10 bg-white border border-gray-100 rounded-xl shadow-md w-40">
          <ul>
            <li>
              <button className="w-full text-left text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2">
                <i className="bi bi-trash"></i> Remove
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const EventsSection = () => {
  return (
    <div className="mt-8 mb-12">
      {/* Today */}
      <div>
        <div className="flex items-center mb-4 gap-4">
          <span className="text-sm text-gray-400 flex-shrink-0">Today</span>
          <span className="border border-dashed border-gray-200 w-full"></span>
        </div>
        <EventItem
          iconClass="bi bi-grid"
          title="Element of design test"
          time="10:00 - 11:00 AM"
        />
      </div>

      {/* Aug 24 */}
      <div className="mt-6">
        <div className="flex items-center mb-4 gap-4">
          <span className="text-sm text-gray-400 flex-shrink-0">Sat, Aug 24</span>
          <span className="border border-dashed border-gray-200 w-full"></span>
        </div>
        <EventItem
          iconClass="bi bi-magic"
          title="Design Principles test"
          time="10:00 - 11:00 AM"
          className="mt-2"
        />
        <EventItem
          iconClass="bi bi-briefcase"
          title="Prepare Job Interview"
          time="09:00 - 10:00 AM"
          className="mt-2"
        />
      </div>

      <a
        href="/event"
        className="block bg-blue-600 hover:bg-blue-700 text-white text-sm text-center py-2 rounded-lg mt-6"
      >
        All Events
      </a>
    </div>
  );
};

export default EventsSection;
