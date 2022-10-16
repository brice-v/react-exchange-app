import './App.css';
import { useEffect, useState } from 'react';
import Select from 'react-select'

function App() {
  const [data, setData] = useState(null);
  const [numToConvert, setNumToConvert] = useState(1);
  const handleNumToConvert = (event) => {
    setNumToConvert(event.target.value);
  }
  // const data = await (await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`)).json()
  const convert = async () => {
    console.log(numToConvert);
    var isFromValue = document.getElementsByName('isFrom')[0].value;
    var isToValue = document.getElementsByName('isTo')[0].value;
    let resp = await get_rates(isFromValue, isToValue);
    console.log(`resp = ${JSON.stringify(resp)}`);
    let multiplier = resp.info.rate;
    let dataResp = `${numToConvert} ${isFromValue} is ${numToConvert*multiplier} ${isToValue}`;
    console.log(`numToConvert ${numToConvert} ${isFromValue} is ${numToConvert*multiplier} ${isToValue}`)
    setData(dataResp);
  }
  return (
    <div>Convert
    <input type="number" onChange={handleNumToConvert} value={numToConvert} />
    from
    <SelectBaseRates isFrom="true" />
    to
    <SelectBaseRates />
    <button type="submit" onClick={convert}>Convert!</button>
    <div id="result">{data === null ? '' : <h1>{data}</h1>}</div>
    </div>
  );
}

function SelectBaseRates(props) {
  // console.log(props.isFrom);
  const [apiResp, setApiResp] = useState([]);
  const [state, setState] = useState(props.isFrom ? {label: 'USD', value: 'USD'} : apiResp[0]);
  const handleInputChange = (newValue) => {
    setState({label: newValue.label, value: newValue.value});
  }
  const get_conversion_rates = async () => {
    return await fetch_base_rates("USD");
  }

  useEffect(() => {
    get_conversion_rates().then(result => {
      setApiResp(result)
      console.log(result);
    });
  });

  return (
      <Select
        defaultValue={props.isFrom ? {label: 'USD', value: 'USD'} : apiResp[0]}
        value={state}
        onChange={handleInputChange}
        options={apiResp}
        name={props.isFrom ? "isFrom" : "isTo"}/>
  );
}

let rates = undefined;
async function fetch_base_rates(base) {
  if (rates === undefined) {
    rates = [];
    let resp = await fetch(get_api_url(base));
    let resp_json = await resp.json();
    Object.keys(resp_json.rates).forEach(e => rates.push({label: e, value: e}));
  }
  return rates;
}

async function get_rates(from, to) {
  let resp = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}`);
  let resp_json = await resp.json();
  return resp_json;
}



function get_api_url(base) {
  const b = base === null || base === undefined ? 'USD' : base;
  const api_url = `https://api.exchangerate.host/latest?base=${b}`;
  return api_url;
}

export default App;
