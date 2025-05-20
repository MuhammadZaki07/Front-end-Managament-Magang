import React, { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import './calendar-custom.css'
import TambahJadwalPresentasi from '../../components/modal/TambahJadwalPresentasi'
import DetailsPresentasi from '../../components/modal/DetailsPresentasi'

const Calendar = () => {
  const [view, setView] = useState('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const calendarRef = useRef(null)
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  
  // Sample participants data
  const sampleParticipants = [
    [
      { id: 1, name: 'Budi Santoso', photo: '/assets/img/Profil.png', projectStage: 'Tahap 1', status: 'hadir' },
      { id: 2, name: 'Dewi Lestari', photo: '/assets/img/Profil.png', projectStage: 'Tahap 1', status: 'hadir' },
      { id: 3, name: 'Eko Prasetyo', photo: '/assets/img/Profil.png', projectStage: 'Tahap 1', status: 'tidak hadir' }
    ],
    [
      { id: 4, name: 'Farida Wijaya', photo: '/assets/img/Profil.png', projectStage: 'Tahap 2', status: 'hadir' },
      { id: 5, name: 'Gunawan Hidayat', photo: '/assets/img/Profil.png', projectStage: 'Tahap 2', status: 'hadir' },
      { id: 6, name: 'Heni Mulyani', photo: '/assets/img/Profil.png', projectStage: 'Tahap 2', status: 'tidak hadir' },
      { id: 7, name: 'Indra Kusuma', photo: '/assets/img/Profil.png', projectStage: 'Tahap 2', status: 'hadir' }
    ],
    [
      { id: 8, name: 'Joko Widodo', photo: '/assets/img/Profil.png', projectStage: 'Tahap 3', status: 'hadir' },
      { id: 9, name: 'Kartika Sari', photo: '/assets/img/Profil.png', projectStage: 'Tahap 3', status: 'hadir' }
    ],
    [
      { id: 10, name: 'Lisa Permata', photo: '/assets/img/Profil.png', projectStage: 'Tahap 4', status: 'hadir' },
      { id: 11, name: 'Maman Suryaman', photo: '/assets/img/Profil.png', projectStage: 'Tahap 4', status: 'tidak hadir' },
      { id: 12, name: 'Novi Susanti', photo: '/assets/img/Profil.png', projectStage: 'Tahap 4', status: 'hadir' },
      { id: 13, name: 'Oki Setiawan', photo: '/assets/img/Profil.png', projectStage: 'Tahap 4', status: 'hadir' },
      { id: 14, name: 'Putri Rahayu', photo: '/assets/img/Profil.png', projectStage: 'Tahap 4', status: 'hadir' }
    ],
    [
      { id: 15, name: 'Ratu Maharani', photo: '/assets/img/Profil.png', projectStage: 'Tahap 5', status: 'hadir' },
      { id: 16, name: 'Surya Darma', photo: '/assets/img/Profil.png', projectStage: 'Tahap 5', status: 'tidak hadir' }
    ],
    [
      { id: 17, name: 'Tono Sucipto', photo: '/assets/img/Profil.png', projectStage: 'Tahap 6', status: 'hadir' },
      { id: 18, name: 'Umi Kaltsum', photo: '/assets/img/Profil.png', projectStage: 'Tahap 6', status: 'hadir' },
      { id: 19, name: 'Vina Panduwinata', photo: '/assets/img/Profil.png', projectStage: 'Tahap 6', status: 'tidak hadir' }
    ]
  ];
  
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
  }

  // Handle add new event
  const handleAddEvent = () => {
    setShowAddModal(true)
  }
  
  // Handle add event form submission
  const handleAddEventSubmit = (eventData) => {
    // Get current date from calendar
    const calendarApi = calendarRef.current.getApi()
    const currentDate = calendarApi.getDate()
    
    // Format the date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split('T')[0]
    
    // Set the background and text colors based on the selected status
    let backgroundColor, textColor, borderColor
    
    if (eventData.status === 'online') {
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
      title: eventData.title,
      start: formattedDate,
      backgroundColor,
      textColor,
      borderColor,
      extendedProps: {
        status: eventData.status,
        quota: eventData.quota,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        zoomLink: eventData.zoomLink,
        location: eventData.location,
        participants: [] // Start with empty participants list
      }
    }
    
    // Add the new event to the events array
    setEvents(prevEvents => [...prevEvents, newEvent])
    
    console.log('New event added:', newEvent)
    
    // Close the modal
    setShowAddModal(false)
  }

  // Toggle attendance status for participants
  const toggleAttendanceStatus = (eventId, participantId, newStatus) => {
    setEvents(prevEvents => {
      return prevEvents.map(event => {
        if (event === eventId) {
          return {
            ...event,
            extendedProps: {
              ...event.extendedProps,
              participants: event.extendedProps.participants.map(participant => {
                if (participant.id === participantId) {
                  return { ...participant, status: newStatus };
                }
                return participant;
              })
            }
          };
        }
        return event;
      });
    });
  };

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
      
      {/* Add Event Modal */}
      <TambahJadwalPresentasi 
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddEventSubmit}
      />
      
      {/* Event Detail Modal */}
      {selectedEvent && (
        <DetailsPresentasi
          show={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          event={selectedEvent}
          onToggleAttendance={toggleAttendanceStatus}
        />
      )}
    </div>
  )
}

export default Calendar