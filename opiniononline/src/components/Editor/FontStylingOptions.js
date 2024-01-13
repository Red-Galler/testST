import { Option, Select } from "@material-tailwind/react";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa"; // Update the path to your icons
import IconButton from "../IconButton";

function FontStylingOptions({
  label,
  values,
  onSelectChanges,
  onButtonClicks, 
  showButtons = true
}) {


    const classNameButtons = "bg-primary text-white";
  return (
    <div className="p-3">
      <p className="font-semibold">{label}</p>
      <div className="mt-1">
        <Select
          labelProps={{
            className: 'before:mr-0 after:ml-0 before:pr-0 after:pl-0',
          }}
          value={values?.fontFamily}
          onChange={(newValue) => onSelectChanges.onFontFamilyChange(newValue)}
        >
          <Option value="font-sans">font-sans</Option>
          <Option value="font-serif">font-serif</Option>
          <Option value="font-mono">font-mono</Option>
        </Select>
        <Select
          value={values?.fontSize}
          labelProps={{
            className: 'before:mr-0 after:ml-0 before:pr-0 after:pl-0',
          }}
          containerProps={{
            className: '!mt-2',
          }}
          onChange={(newValue) => onSelectChanges.onFontSizeChange(newValue)}
        >
          <Option value="xl">xl</Option>
          <Option value="2xl">2xl</Option>
          <Option value="3xl">3xl</Option>
          <Option value="4xl">4xl</Option>
        </Select>

        <div className={`${showButtons ? " flex": "hidden"} gap-2 mt-4 text-xl`}>
          <IconButton
            icon={FaBold}
            message={'Vet'}
            onClick={() => onButtonClicks.Bold()}
            className={`${values?.isBold ? classNameButtons : ""}`}
          />

          <IconButton
            icon={FaItalic}
            message={'Cursief'}
            onClick={() => onButtonClicks.Cursive()}
            className={`${values?.isCursive ? classNameButtons : ""}`}
          />
          <IconButton
            icon={FaUnderline}
            message={'Onderstrepen'}
            onClick={() => onButtonClicks.Underlined()}
            className={`${values?.isUnderlined ? classNameButtons : ""}`}
          />
        </div>
      </div>
    </div>
  );
}

export default FontStylingOptions;
