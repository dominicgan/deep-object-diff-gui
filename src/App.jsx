import { useRef, useState } from "react";
import "./App.css";
import { detailedDiff } from "deep-object-diff";
import { JsonViewer } from "@textea/json-viewer";
import { Alert } from "@mui/material";

function App() {
  const [objDiff, setObjDiff] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const formRef = useRef(null);

  const calculateDiff = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // clear errors on retry
    setErrorMsg(null);

    try {
      if (!formRef.current) {
        console.log("form ref is null", null);
      }
      const formData = new FormData(formRef.current);

      const originalDataRaw = formData.get("originalData");
      const changedDataRaw = formData.get("changedData");

      const originalData = JSON.parse(originalDataRaw);
      const changedData = JSON.parse(changedDataRaw);
      console.log({
        originalData,
        changedData,
      });

      const diff = detailedDiff(originalData, changedData);

      console.log(diff);

      setObjDiff(diff);
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  const renderCodeBlock = (
    data,
    {
      defaultInspectDepth = 2,
      maxDisplayLength = 30,
      groupArraysAfterLength = 100,
      ...otherProps
    } = {}
  ) => {
    if (!!data && Object.keys(data).length !== 0) {
      return (
        <JsonViewer
          defaultInspectDepth={defaultInspectDepth}
          displayDataTypes={false}
          displaySize={false}
          groupArraysAfterLength={groupArraysAfterLength}
          maxDisplayLength={maxDisplayLength}
          theme="dark"
          value={data}
          {...otherProps}
        />
      );
    }
    return null;
  };

  return (
    <>
      <div></div>
      <h1>deep-object-diff</h1>
      <div className="card">
        <form action="javascript:void(0)" ref={formRef}>
          <fieldset className="diff-fieldset">
            <label>
              <span>Original Value</span>
              <textarea name="originalData" rows="15" />
            </label>
            <label>
              <span>Changed Data Value</span>
              <textarea name="changedData" rows="15" />
            </label>
          </fieldset>
        </form>
        {errorMsg && (
          <Alert sx={{ my: 2 }} severity="error">
            {errorMsg}
          </Alert>
        )}
        <button className="submitBtn" type="button" onClick={calculateDiff}>
          Calculate Diff
        </button>
        {objDiff && <div className="output">{renderCodeBlock(objDiff)}</div>}
      </div>
    </>
  );
}

export default App;
