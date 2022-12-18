import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment';

import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Container, Modal, Box } from '@mui/material';

import EditEvent from '../EditEvent/EditEvent'

export default function MyCalendar() {

  // import events from the store. populated with starter events from events.js.
  // each event looks like: {
  //   id: 0,
  //   title: 'All Day Event very long title',
  //   allDay: true,
  //   start: new Date(2022, 12, 0),
  //   end: new Date(2022, 12, 1),
  //   hex: '#fb8500',
  //   text: '#fffff'
  // }

  const myEvents = useSelector(store => store.events)

  const [eventToEdit, setEventToEdit] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


  const dispatch = useDispatch();

  // prepare a calendar component with drag and drop functionalities
  const DnDCalendar = withDragAndDrop(Calendar);

  // localizer determines date formatting
  const localizer = momentLocalizer(moment);

  // local state for events. this should probably change to using redux?
  // const [myEvents, setMyEvents] = useState(events);

  const updateEvents = (payload) => {
    dispatch({ type: 'SET_EVENTS', payload: payload })
  }

  // --------------- CALENDAR FUNCTIONS ---------------


  // use callback will limit the re-renders to ONLY when dependency values change

  // move event triggers on 'onEventDrop'
  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      console.log('moved event: ', event);
      console.log('start/end: ', start, end);

      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }

      // update list of events:
      // filtered: all events not moved - return unaltered.
      // existing: moved event is stored with updated start, end, and allDay values.

      const existing = myEvents.find((ev) => ev.id === event.id) ?? {}
      const filtered = myEvents.filter((ev) => ev.id !== event.id)
      updateEvents([...filtered, { ...existing, start, end, allDay }]
      )
    },
    [updateEvents]
  )

  // resizeEvent triggers 'onEventResize
  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      console.log(event)
      const existing = myEvents.find((ev) => ev.id === event.id) ?? {}
      const filtered = myEvents.filter((ev) => ev.id !== event.id)
      updateEvents([...filtered, { ...existing, start, end }]
      )
    },
    [updateEvents]
  )

  // currently empty; can be populated with functionality
  // a good use for this will be editing events
  const handleSelectEvent = useCallback(
    (event) => {
      setEventToEdit(event);
      setModalOpen(true)
    },
    []
  )

  // this fires when user clicks an empty slot (presumably to create a new event)
  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      // in this example, start is automatically 00:00:00 GMT of previous day to 00:00:00 GMT of selected day (24 hrs midnight-midnight)
      const title = window.prompt('NEW EVENT NAME')
      if (title) {
        updateEvents([...myEvents, { start, end, title }])
      }
      // this example yields an event with only start, end, and title values
    },
    [updateEvents]
  )

  const getEventStyles = (event) => {
    const style = {
      backgroundColor: event.hex,
      borderRadius: '6px',
      opacity: 0.8,
      color: event.text,
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  }

  //DnDCalendar has built in listeners for event drop, resize, select, and select slot. get event styles helps apply style values in the event object to each event.
  return (
    <Container sx={{ height: 600 }}>
      <DnDCalendar
        localizer={localizer}
        events={myEvents}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        draggableAccessor={(event) => true}
        eventPropGetter={getEventStyles}
      />
      <Modal
        open={modalOpen}
      >
        <Box sx = {modalStyle}>
          <EditEvent event={eventToEdit} setModalOpen = {setModalOpen} />
        </Box>
      </Modal>
    </Container>

  )
}