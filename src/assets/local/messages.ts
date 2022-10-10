export const messages = {
  en: {
    header: {
      day_time: "Time of day",
      diastolic_bp: "Diastolic BP",
      heart_rate: "Pulse",
      systolic_bp: "Systolic BP",
      timestamp: "Timestamp",
      user_id: "User ID",
      weather: "Weather",
      time: "Time",
      date: "Date",
      id: "ID",
      edit: "Edit",
      statistics: "Statistics",
      data: "Data",
      latest: "Latest",
      entries: "Entries",
      days: "Days",
      values: "Days by values",
      min_max: "Minimums and maximums",
    },
    daytime: {
      morning: "Morning",
      lunch: "Noon",
      evening: "Evening",
      other: "Other",
      daytime: "Time of day",
    },
    messages: {
      choose_header: "Choose which columns to display:",
      settings: "Settings",
      reading_from: "Reading from",
      values: "Values:",
      additional_data: "Additional data",
      network_error_title: "Network error",
      network_error_info: "Server is unavailable or unreachable.",
      invalid_response: "Invalid response",
      invalid_response_details: "Server is reachable but response was unexpected.",
      edit_reading: "Edit entry",
      select_daytime: "Select time of day",
      days: "Days",
      last: "Last...",
      per_page: "Rows per page:",
    },
    controls: {
      from: "From...",
      to: "To...",
      filter_by_date: "Filter by date:",
      confirm: "Confirm",
      enter: "Confirm",
      retry: "Retry",
      cancel: "Cancel",
      reset: "Reset",
      delete_entry: "Delete entry",
      new_entry: "New entry",
    },
  },
  de: {
    header: {
      day_time: "Tageszeit",
      diastolic_bp: "Dia",
      heart_rate: "Puls",
      systolic_bp: "Sys",
      timestamp: "Zeitpunkt",
      user_id: "User ID",
      weather: "Wetter",
      time: "Zeit",
      date: "Datum",
      id: "Interne ID",
      edit: "Bearbeiten",
      statistics: "Statistik",
      data: "Tabellen",
      latest: "Neu",
      entries: "Einträge",
      days: "Tage",
      values: "Tage nach Wert",
      min_max: "Maximal- und Minimalwerte",
    },
    daytime: {
      morning: "Morgen",
      lunch: "Mittag",
      evening: "Abend",
      other: "Sonstige",
      daytime: "Tageszeit",
    },
    messages: {
      choose_header: "Säulen auswählen:",
      settings: "Einstellungen",
      reading_from: "Eintrag vom",
      values: "Werte:",
      additional_data: "Zusätzliche Daten",
      network_error_title: "Netzwerk Fehler",
      network_error_info: "Server kann nicht erreicht werden oder ist nicht verfügbar.",
      invalid_response: "Ungültige Antwortmeldung",
      invalid_response_details:
        "Server ist erreichbar, hat aber eine ungültige Antwort gesendet. Bitte Fehlermeldung oben notieren und Clemens informieren :).",
      edit_reading: "Eintrag bearbeiten",
      select_daytime: "Tageszeit auswählen",
      days: "Tage",
      last: "Letzte...",
      per_page: "Reien per Seite:",
    },
    controls: {
      from: "Von...",
      to: "Bis...",
      filter_by_date: "Filtern nach Datum:",
      confirm: "Bestätigen",
      enter: "Eintragen",
      retry: "Erneut versuchen",
      cancel: "Abbrechen",
      reset: "Zurücksetzen",
      delete_entry: "Eintrag löschen",
      new_entry: "Neuer Eintrag",
    },
  },
};

export const datetimeFormats = {
  en: {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
    },
  },
  de: {
    short: {
      month: "2-digit",
      day: "2-digit",
    },
    long: {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    },
  },
};
