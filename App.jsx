{
  "name": "Event",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Event title"
    },
    "start_datetime": {
      "type": "string",
      "description": "Event start date and time in ISO format"
    },
    "end_datetime": {
      "type": "string",
      "description": "Event end date and time in ISO format"
    },
    "notes": {
      "type": "string",
      "description": "Additional notes for the event"
    },
    "location": {
      "type": "string",
      "description": "Event location"
    },
    "timezone": {
      "type": "string",
      "description": "Timezone for the event",
      "default": "America/New_York"
    }
  },
  "required": [
    "title",
    "start_datetime",
    "end_datetime"
  ]
}