import React, { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './calendar-custom.css'

const Calendar = () => {
  const [view, setView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef(null)
  
  // Modal state and animation
  const [showModal, setShowModal] = useState(false)
  const [animateModal, setAnimateModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    quota: '',
    startTime: '',
    endTime: '',
    zoomLink: '',
    location: ''
  })
  
  // Detail modal state
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [animateDetailModal, setAnimateDetailModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  
  // Sample participants data
  const sampleParticipants = [
    [
      { id: 1, name: 'Budi Santoso', email: 'budi.s@example.com', status: 'hadir' },
      { id: 2, name: 'Dewi Lestari', email: 'dewi.l@example.com', status: 'hadir' },
      { id: 3, name: 'Eko Prasetyo', email: 'eko.p@example.com', status: 'tidak hadir' }
    ],
    [
      { id: 4, name: 'Farida Wijaya', email: 'farida.w@example.com', status: 'hadir' },
      { id: 5, name: 'Gunawan Hidayat', email: 'gunawan.h@example.com', status: 'hadir' },
      { id: 6, name: 'Heni Mulyani', email: 'heni.m@example.com', status: 'tidak hadir' },
      { id: 7, name: 'Indra Kusuma', email: 'indra.k@example.com', status: 'hadir' }
    ],
    [
      { id: 8, name: 'Joko Widodo', email: 'joko.w@example.com', status: 'hadir' },
      { id: 9, name: 'Kartika Sari', email: 'kartika.s@example.com', status: 'hadir' }
    ],
    [
      { id: 10, name: 'Lisa Permata', email: 'lisa.p@example.com', status: 'hadir' },
      { id: 11, name: 'Maman Suryaman', email: 'maman.s@example.com', status: 'tidak hadir' },
      { id: 12, name: 'Novi Susanti', email: 'novi.s@example.com', status: 'hadir' },
      { id: 13, name: 'Oki Setiawan', email: 'oki.s@example.com', status: 'hadir' },
      { id: 14, name: 'Putri Rahayu', email: 'putri.r@example.com', status: 'hadir' }
    ],
    [
      { id: 15, name: 'Ratu Maharani', email: 'ratu.m@example.com', status: 'hadir' },
      { id: 16, name: 'Surya Darma', email: 'surya.d@example.com', status: 'tidak hadir' }
    ],
    [
      { id: 17, name: 'Tono Sucipto', email: 'tono.s@example.com', status: 'hadir' },
      { id: 18, name: 'Umi Kaltsum', email: 'umi.k@example.com', status: 'hadir' },
      { id: 19, name: 'Vina Panduwinata', email: 'vina.p@example.com', status: 'tidak hadir' }
    ]
  ]
  
  // Sample events with colors based on status
  const [events, setEvents] = useState([
    { 
      title: 'Presentasi online', 
      start: '2025-04-01', 
      allDay: true, 
      backgroundColor: '#FEF9C3', // Yellow for online
      textColor: '#CA8A04', 
      borderColor: '#FEF9C3',
      extendedProps: { 
        status: 'online',
        quota: '30',
        startTime: '09:00',
        endTime: '11:00',
        zoomLink: 'https://zoom.us/j/123456789',
        location: '',
        participants: sampleParticipants[0]
      }
    },
    { 
      title: 'Presentasi offline', 
      start: '2025-04-08', 
      backgroundColor: '#E6EFFF', // Blue for offline
      textColor: '#3B82F6', 
      borderColor: '#E6EFFF',
      extendedProps: { 
        status: 'offline',
        quota: '15',
        startTime: '13:00',
        endTime: '15:00',
        zoomLink: '',
        location: 'Ruang Meeting Lt. 3',
        participants: sampleParticipants[1]
      }
    },
    { 
      title: 'Presentasi offline', 
      start: '2025-04-15', 
      backgroundColor: '#E6EFFF', // Blue for offline
      textColor: '#3B82F6', 
      borderColor: '#E6EFFF',
      extendedProps: { 
        status: 'offline',
        quota: '20',
        startTime: '10:00',
        endTime: '12:00',
        zoomLink: '',
        location: 'Auditorium',
        participants: sampleParticipants[2]
      }
    },
    { 
      title: 'Presentasi online', 
      start: '2025-04-11', 
      backgroundColor: '#FEF9C3', // Yellow for online
      textColor: '#CA8A04', 
      borderColor: '#FEF9C3',
      extendedProps: { 
        status: 'online',
        quota: '50',
        startTime: '14:00',
        endTime: '16:00',
        zoomLink: 'https://zoom.us/j/987654321',
        location: '',
        participants: sampleParticipants[3]
      }
    },
    { 
      title: 'Presentasi offline', 
      start: '2025-04-11', 
      backgroundColor: '#E6EFFF', // Blue for offline
      textColor: '#3B82F6', 
      borderColor: '#E6EFFF',
      extendedProps: { 
        status: 'offline',
        quota: '25',
        startTime: '09:00',
        endTime: '11:00',
        zoomLink: '',
        location: 'Ruang Rapat Utama',
        participants: sampleParticipants[4]
      }
    },
    { 
      title: 'Presentasi offline', 
      start: '2025-04-12', 
      backgroundColor: '#E6EFFF', // Blue for offline
      textColor: '#3B82F6', 
      borderColor: '#E6EFFF',
      extendedProps: { 
        status: 'offline',
        quota: '15',
        startTime: '13:30',
        endTime: '15:30',
        zoomLink: '',
        location: 'Ruang Training',
        participants: sampleParticipants[5]
      }
    }
  ])
  
  // Format the current date to display month and year
  const formatMonthYear = (date) => {
    const options = { month: 'long', year: 'numeric' }
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }
  
  // Update the title when calendar view changes
  const updateTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi()
      const newDate = calendarApi.getDate()
      setCurrentDate(newDate)
    }
  }
  
  // Update title on initial load
  useEffect(() => {
    if (calendarRef.current) {
      updateTitle()
    }
  }, [])
  
  const handleViewChange = (newView) => {
    setView(newView)
    
    // Map our simplified view names to FullCalendar view names
    const viewMap = {
      'day': 'timeGridDay',
      'week': 'timeGridWeek',
      'month': 'dayGridMonth'
    }
    
    // Change the calendar view
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewMap[newView])
      updateTitle()
    }
  }
  
  // Navigation handlers
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev()
      updateTitle()
    }
  }
  
  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next()
      updateTitle()
    }
  }
  
  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today()
      updateTitle()
    }
  }
  
  // Handle dates changes
  const handleDatesSet = (dateInfo) => {
    setCurrentDate(dateInfo.view.currentStart)
  }

  // Handle event click to show detail modal
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event)
    setShowDetailModal(true)
    // Use setTimeout to allow the modal to render before animating
    setTimeout(() => {
      setAnimateDetailModal(true)
    }, 10)
  }

  // Modal handlers
  const handleAddEvent = () => {
    setShowModal(true)
    // Use setTimeout to allow the modal to render before animating
    setTimeout(() => {
      setAnimateModal(true)
    }, 10)
  }
  
  const closeModal = () => {
    setAnimateModal(false)
    setTimeout(() => {
      setShowModal(false)
      // Reset form data
      setFormData({
        title: '',
        quota: '',
        startTime: '',
        endTime: '',
        zoomLink: '',
        location: ''
      })
      setSelectedStatus('')
    }, 300) // Match the duration of the transition
  }
  
  const closeDetailModal = () => {
    setAnimateDetailModal(false)
    setTimeout(() => {
      setShowDetailModal(false)
      setSelectedEvent(null)
    }, 300) // Match the duration of the transition
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Get current date from calendar
    const calendarApi = calendarRef.current.getApi()
    const currentDate = calendarApi.getDate()
    
    // Format the date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split('T')[0]
    
    // Set the background and text colors based on the selected status
    let backgroundColor, textColor, borderColor
    
    if (selectedStatus === 'online') {
      backgroundColor = '#FEF9C3' // Yellow for online
      textColor = '#CA8A04'
      borderColor = '#FEF9C3'
    } else {
      backgroundColor = '#E6EFFF' // Blue for offline
      textColor = '#3B82F6'
      borderColor = '#E6EFFF'
    }
    
    // Create the new event
    const newEvent = {
      title: formData.title,
      start: formattedDate,
      backgroundColor,
      textColor,
      borderColor,
      extendedProps: {
        status: selectedStatus,
        quota: formData.quota,
        startTime: formData.startTime,
        endTime: formData.endTime,
        zoomLink: formData.zoomLink,
        location: formData.location,
        participants: [] // Start with empty participants list
      }
    }
    
    // Add the new event to the events array
    setEvents(prevEvents => [...prevEvents, newEvent])
    
    console.log('New event added:', newEvent)
    
    // Close the modal
    closeModal()
  }

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Intl.DateTimeFormat('id-ID', options).format(date)
  }

  return (
    <div className="calendar-wrapper">
      {/* Header outside the card */}
      <div className="calendar-header">
        <div className="header-content">
          {/* Left section */}
          <div className="left-section">
            <button className="add-event-btn" onClick={handleAddEvent}>
              <span className="plus-icon">+</span> Tambah Jadwal
            </button>
            <h2 className="month-title">{formatMonthYear(currentDate)}</h2>
          </div>
          
          {/* Center section - Day Week Month */}
          <div className="center-section">
            <div className="view-options">
              <button 
                className={`view-btn ${view === 'day' ? 'active' : ''}`}
                onClick={() => handleViewChange('day')}
              >
                Day
              </button>
              <button 
                className={`view-btn ${view === 'week' ? 'active' : ''}`}
                onClick={() => handleViewChange('week')}
              >
                Week
              </button>
              <button 
                className={`view-btn ${view === 'month' ? 'active' : ''}`}
                onClick={() => handleViewChange('month')}
              >
                Month
              </button>
            </div>
          </div>
          
          {/* Right section */}
          <div className="right-section">
            <div className="navigation-buttons">
              <button className="nav-btn prev" onClick={handlePrev}>
                <span>‹</span>
              </button>
              <button className="nav-btn next" onClick={handleNext}>
                <span>›</span>
              </button>
              <button className="today-btn" onClick={handleToday}>Today</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar inside the card */}
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={events}
          height="auto"
          dayMaxEvents={3}
          fixedWeekCount={false}
          firstDay={1} // Start week on Monday
          dayCellClassNames="calendar-day"
          dayHeaderClassNames="day-header"
          eventClassNames="calendar-event"
          aspectRatio={1.5}
          datesSet={handleDatesSet} // Listen for date changes
          eventClick={handleEventClick} // Listen for event clicks
        />
      </div>
      
      {/* Modal for adding event - Fixed the duplicate modal wrapper */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
          <div
            className={`bg-white w-full max-w-3xl rounded-2xl p-6 transition-all duration-300 transform ${
              animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tambah Jadwal Presentasi</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
              <div>
                <label className="block font-medium">
                  Judul Presentasi <span className="text-red-500">(Required)</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Judul Presentasi"
                  className="w-full border border-[#D5DBE7] rounded-lg p-2 mt-1"
                  maxLength={100}
                  required
                />
                <p className="text-right text-xs text-gray-500 mt-1">
                  {formData.title.length} / 100
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Kuota</label>
                  <input
                    type="number"
                    name="quota"
                    value={formData.quota}
                    onChange={handleInputChange}
                    className="w-full border border-[#D5DBE7] rounded-lg p-2"
                    placeholder="Masukkan Kuota"
                  />
                </div>
                <div>
                  <label className="block font-medium">Status Presentasi</label>
                  <select 
                    className="w-full border border-[#D5DBE7] rounded-lg p-2"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    value={selectedStatus}
                  >
                    <option value="">Pilih status presentasi</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Jam Presentasi</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full border border-[#D5DBE7] rounded-lg p-2"
                    />
                    <span className="self-center">-</span>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full border border-[#D5DBE7] rounded-lg p-2"
                    />
                  </div>
                </div>
                
                {/* Conditional rendering based on selected status */}
                {selectedStatus === "online" && (
                  <div>
                    <label className="block font-medium">Link Zoom</label>
                    <input
                      type="text"
                      name="zoomLink"
                      value={formData.zoomLink}
                      onChange={handleInputChange}
                      className="w-full border border-[#D5DBE7] rounded-lg p-2"
                      placeholder="Masukkan Link Zoom"
                    />
                  </div>
                )}
                
                {selectedStatus === "offline" && (
                  <div>
                    <label className="block font-medium">Lokasi</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full border border-[#D5DBE7] rounded-lg p-2"
                      placeholder="Masukkan Lokasi"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal for event details */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
          <div
            className={`bg-white w-full max-w-4xl rounded-2xl p-5 transition-all duration-300 transform ${
              animateDetailModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <div className="flex justify-between items-center mb-7">
              <h3 className="text-lg font-semibold">Detail Jadwal Presentasi</h3>
              <button 
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic info */}
              <div className="flex flex-col md:flex-row justify-evenly items-start md:items-center">
                <div className="space-y-4 w-full md:w-1/2 mb-4 md:mb-0">
                  <div>
                    <h4 className="font-medium text-gray-600">Judul Presentasi</h4>
                    <p className="text-lg">{selectedEvent.title}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-600">Tanggal</h4>
                      <p>{formatDate(selectedEvent.startStr)}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Status</h4>
                      <div className="flex items-center">
                        <span 
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            selectedEvent.extendedProps.status === 'online' 
                              ? 'bg-yellow-400' 
                              : 'bg-blue-500'
                          }`}
                        ></span>
                        <span className="capitalize">{selectedEvent.extendedProps.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-600">Waktu</h4>
                      <p>{selectedEvent.extendedProps.startTime} - {selectedEvent.extendedProps.endTime}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Kuota</h4>
                      <p>{selectedEvent.extendedProps.quota} peserta</p>
                    </div>
                  </div>
                  
                  {selectedEvent.extendedProps.status === 'online' && (
                    <div>
                      <h4 className="font-medium text-gray-600">Link Zoom</h4>
                      <a 
                        href={selectedEvent.extendedProps.zoomLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {selectedEvent.extendedProps.zoomLink}
                      </a>
                    </div>
                  )}
                  
                  {selectedEvent.extendedProps.status === 'offline' && (
                    <div>
                      <h4 className="font-medium text-gray-600">Lokasi</h4>
                      <p>{selectedEvent.extendedProps.location}</p>
                    </div>
                  )}
                </div>
                
                {/* Participants list */}
                <div className="w-full md:w-1/2">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-600">Daftar Peserta</h4>
                    <div className="text-sm">
                      <span className="font-medium">{selectedEvent.extendedProps.participants ? selectedEvent.extendedProps.participants.length : 0}</span>
                      <span className="text-gray-500"> / {selectedEvent.extendedProps.quota}</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg max-h-80 w-full overflow-y-auto">
                    {selectedEvent.extendedProps.participants && selectedEvent.extendedProps.participants.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedEvent.extendedProps.participants.map((participant) => (
                            <tr key={participant.id}>
                              <td className="px-4 py-2 whitespace-nowrap">{participant.name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{participant.email}</td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  participant.status === 'hadir' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {participant.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Belum ada peserta yang terdaftar
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={closeDetailModal}
                className="px-4 py-2 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar