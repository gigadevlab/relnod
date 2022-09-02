import React from "react";

interface DateRangePickerProps {
  onChange?: (start?: Date, end?: Date) => any;
}

const DateRangePicker = (props: DateRangePickerProps) => {
  const [start, setStart] = React.useState<Date>();
  const [end, setEnd] = React.useState<Date>();

  React.useEffect(() => {
    if (props.onChange) props.onChange(start, end);
  }, [start, end])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type: "start" | "end") => {
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
    <div style={{margin: "20px", float: "left"}}>
      <form>
        <label>Start: </label>
        <input type={"date"} name={"start"} onChange={(e) => handleChange(e, "start")}/>
        <label> End: </label>
        <input type={"date"} name={"end"} onChange={(e) => handleChange(e, "end")}/>
      </form>
    </div>
  )
}

export default DateRangePicker;
