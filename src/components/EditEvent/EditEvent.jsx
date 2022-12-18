import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function EditEvent({ event, setModalOpen }) {

  const dispatch = useDispatch();
  const myEvents = useSelector(store => store.events)
  const [eventInfo, setEventInfo] = useState({ title: event.title, start: event.start, end: event.end })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('in handlSubmit');
    const existing = myEvents.find((ev) => ev.id === event.id) ?? {}
    const filtered = myEvents.filter((ev) => ev.id !== event.id)
    dispatch({ type: 'SET_EVENTS', payload: [...filtered, { ...existing, title: eventInfo.title, start: eventInfo.start, end: eventInfo.end }] })
    setModalOpen(false)
  }

  return (
    <Box component='form' onSubmit={handleSubmit}>
      <TextField
        size='small'
        label='event title'
        value={eventInfo.title}
        onChange={(e) => setEventInfo({ ...eventInfo, title: e.target.value })}
      />
      <Button type='submit'>submit</Button>
    </Box>
  )
}