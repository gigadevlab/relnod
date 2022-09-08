import React from "react";
import { Stack, TextField } from '@mui/material';

interface DateRangePickerProps {
  onChange?: (start?: Date, end?: Date) => any;
}

const DateRangePicker = (props: DateRangePickerProps) => {
  const [start, setStart] = React.useState<Date>();
  const [end, setEnd] = React.useState<Date>();

  React.useEffect(() => {
    if (props.onChange) props.onChange(start, end);
  }, [start, end])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: "start" | "end") => {
    let value = new Date(e.target.value);
    switch (type) {
      case "end":
        setEnd(value);
        break;
      case "start":
        setStart(value);
        break;
    }
  }

  return (
    <Stack style={{margin: "20px", float: "left"}} direction={"row"} spacing={1}>
      <TextField
        type={"date"}
        label={"Start"}
        size={"small"}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => handleChange(e, "start")}
      />
      <TextField
        type={"date"}
        label={"End"}
        size={"small"}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => handleChange(e, "end")}
      />
    </Stack>
  )
}

export default DateRangePicker;
