import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
export default function CountryCodePicker({ whatsapp, setwhatsapp }) {
  const [isFocused, setisFocused] = React.useState(false);

  const inputStyles = {
    width: "100%",
    color: isFocused ? "white" : "white",
    backgroundColor: isFocused ? "#15073a" : "#15073a",
  };

  const handleFocus = () => {
    setisFocused(true);
  };

  const handleBlur = () => {
    setisFocused(false);
  };
  return (
    <PhoneInput
      inputStyle={inputStyles}
      country={"eg"}
      enableSearch={true}
      value={whatsapp}
      onChange={(phone) => setwhatsapp(phone)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
