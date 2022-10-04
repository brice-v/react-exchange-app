import './App.css';
import { useEffect, useState } from 'react';
import Select from 'react-select'

function App() {
  const [data, setData] = useState(null);
  const [numToConvert, setNumToConvert] = useState(9999);
  const handleNumToConvert = (event) => {
    setNumToConvert(event.target.value);
  }
  // const data = await (await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`)).json()
  const convert = async () => {
    console.log(numToConvert);
    // console.log(fromBaseCurrency);
    // console.log(toCurrency);
    // let resp = await get_rates(fromBaseCurrency);
    // // call api and calculate
    // setData(resp);
  }
  return (
    <div>Convert
    <input type="number" onChange={handleNumToConvert} value={numToConvert} />
    from
    <SelectBaseRates isFrom="true" />
    to
    <SelectBaseRates />
    <button type="submit" onClick={convert}>Convert!</button>
    <div id="result">{data}</div>
    </div>
  );
}

function SelectBaseRates(props) {
  // console.log(props.isFrom);
  const [apiResp, setApiResp] = useState([]);
  const [state, setState] = useState({label: 'USD', value: 'USD'});
  const handleInputChange = (newValue) => {
    console.log(newValue);
    setState({label: newValue, value: newValue});
  }
  const get_conversion_rates = async () => {
    return await fetch_base_rates("USD");
  }

  useEffect(() => {
    get_conversion_rates().then(result => setApiResp(result));
  });

  return (
      <Select
        defaultValue={props.isFrom ? {label: 'USD', value: 'USD'} : apiResp[0]}
        value={state}
        onInputChange={handleInputChange}
        options={apiResp}/>
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

async function get_rates(base) {
  let resp = await fetch(get_api_url(base));
  let resp_json = await resp.json();
  return JSON.stringify(resp_json);
}



function get_api_url(base) {
  const b = base === null || base === undefined ? 'USD' : base;
  const api_url = `https://api.exchangerate.host/latest?base=${b}`;
  return api_url;
}

export default App;
