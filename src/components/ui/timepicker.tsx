import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface CustomTimePickerProps {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

export default function CustomTimePicker({
  value,
  onChange,
}: CustomTimePickerProps) {
  // Convertir el valor de Dayjs a formato de input time (HH:mm) o vacío si es null
  const [time, setTime] = useState<string>(value ? value.format("HH:mm") : "");

  // Manejar el cambio en el input
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    // Convertir el nuevo valor a Dayjs o null si está vacío
    if (newTime) {
      const [hours, minutes] = newTime.split(":");
      const newDayjsTime = dayjs()
        .hour(parseInt(hours))
        .minute(parseInt(minutes))
        .second(0);
      onChange(newDayjsTime);
    } else {
      onChange(null);
    }
  };

  return (
    <input
      type="time"
      value={time}
      onChange={handleTimeChange}
      className="w-28 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
    />
  );
}
