import React, { useState } from "react";
import { Card, Button, Form, Input, Select, Typography, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Column } from "@ant-design/plots";
import Papa, { ParseResult } from "papaparse";
import "./App.css";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const countryList = [
  {
    name: "Russia",
    code: "RF",
    cities: [
      "MOSKVA (Moscow)",
      "St Petersburg",
      "Novosibirsk",
      "Nizhny Novgorod",
      "Ekaterinoburg",
      "Samara",
      "Omsk",
      "Kazan",
      "Ufa",
      "Chelyabinsk",
      "Perm",
      "Rostov-na-Donu",
    ],
  },
  {
    name: "Germany",
    code: "DEU",
    cities: [
      "BERLIN",
      "Hamburg",
      "München (Munich)",
      "Köln (Cologne)",
      "Frankfurt am Main",
      "Essen",
      "Dortmund",
      "Stuttgart",
      "Düsseldorf",
    ],
  },
];

type Data = {
  Product: string;
  Price: number;
};

type Values = {
  data: Data[];
};

class CsvDataItem {
  Product: string;
  Price: number;

  constructor(value: Data) {
    this.Product = value.Product;
    this.Price = +value.Price;
  }
}

const columns: ColumnsType<Data> = [
  {
    title: "Product",
    dataIndex: "Product",
    key: "Product",
  },
  {
    title: "Price",
    dataIndex: "Price",
    key: "Price",
  },
];

var csvData: Data[];

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const ageItems = [
  <option key={0} value={0}>
    {0}
  </option>,
];

for (let i = 1; i <= 120; i++) {
  ageItems.push(
    <option key={i} value={i}>
      {i}
    </option>
  );
  //here I will be creating my options dynamically based on
  //what props are currently passed to the parent component
}

const tabList = [
  {
    key: "input",
    tab: "Input",
  },
  {
    key: "output",
    tab: "Output",
  },
];

const App: React.FC = () => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>("input");
  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };

  // This state will store user's name
  const [name, setName] = useState("");

  const [nameFormated, setNameFormated] = useState("");

  //This state will store user's gender
  const [gender, setGender] = useState("");

  //This state will store user's age
  const [age, setAge] = useState(Number);

  //This state will store user's email
  const [email, setEmail] = useState("");

  // This state will store the parsed data
  const [data, setData] = useState<Values | undefined>();

  const [textFieldData, setTextFieldData] = useState("Product, Price\n");

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  var config = {
    data: csvData,
    xField: "Product",
    yField: "Price",
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
      title: {
        text: "Product",
        style: {
          fontSize: 16,
        },
      },
    },
    yAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
      title: {
        text: "Price",
        style: {
          fontSize: 16,
        },
      },
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
  };

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [fromCities, setFromCities] = useState<string[]>();
  const [cityItems, setCityItems] = useState<JSX.Element[]>();
  // const cityItems = [<option key={0} value={0} disabled>Select City</option>];

  const handleName = (e: React.ChangeEvent<any>) => {
    // const nameArray = e.target.value.trim().split(/ /);
    setName(e.target.value);
    var spaceIndex = e.target.value.indexOf(" ");
    if (spaceIndex == -1) {
      setNameFormated(e.target.value);
    } else {
      setNameFormated(
        `${e.target.value.substr(spaceIndex + 1)}, ${e.target.value.substring(
          0,
          spaceIndex
        )}`
      );
    }

    // const [first, ...last] = e.target.value.trim().split(/ /);
    //  setName(`${last.join(" ")}, ${first}`);
    //  console.log(e.target.value.trim().split(/ /));
  };

  const handleFromCountries = (e: string) => {
    console.log(e);
    const countrySelected = countryList.find(
      (countrySelected) => countrySelected.name === e
    );

    setCountry(countrySelected!.name);
    setFromCities(countrySelected!.cities);

    const cityList: JSX.Element[] = [
      <option key={0} value={0} disabled>
        Select City
      </option>,
    ];

    countrySelected!.cities!.map((city, key) =>
      cityList.push(
        <option key={key} title="" value={city}>
          {" "}
          {city}{" "}
        </option>
      )
    );
    setCityItems(cityList!);
  };

  const handleFromCity = (e: string) => {
    const citySelected = fromCities!.find((citySelected) => citySelected === e);
    setCity(citySelected!);
  };

  // This function will be called when
  // the file input changes
  const handleFileChange = (e: React.ChangeEvent<any>) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }
      // If input type is correct set the state
      setFile(inputFile);
      Papa.parse(inputFile, {
        header: true,
        download: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (results: ParseResult<Data>) => {
          setData(results);
          csvData = results?.data.map((item) => new CsvDataItem(item));
        },
      });
    }
  };

  const uploadFileHandler = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    let textData = "Product, Price\n";
    data?.data.forEach(function (value) {
      console.log(value);
      textData += `${value.Product}, ${value.Price}\n`;
    });
    setTextFieldData(textData);
  };

  const inputContent = (
    <div>
      <Form>
        <Title level={3}>User</Title>
        <Form.Item>
          <Input.Group compact>
            <Form.Item label="Name">
              <Input placeholder="Name" onChange={handleName} value={name} />
            </Form.Item>
            <Form.Item label="Gender">
              <Select
                defaultValue={gender}
                showSearch
                style={{ width: 200 }}
                onChange={(e) => setGender(e)}
                placeholder="Please select gender"
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Unspecified">Unspecified</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Age">
              <Select
                defaultValue={age}
                showSearch
                style={{ width: 200 }}
                onChange={(e) => setAge(e)}
                placeholder="Please select age"
              >
                {ageItems}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item>
          <Input.Group compact>
            <Form.Item label="Email">
              <Input onChange={(e) => setEmail(e.target.value)} value={email} />
            </Form.Item>
            <Form.Item label="Select Country">
              <Select
                defaultValue={country}
                className="rounded-0 shadow"
                onChange={handleFromCountries}
              >
                <option className="d-none" value="">
                  Select Country
                </option>
                {countryList.map((country, key) => (
                  <option key={key} title={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Select City">
              <Select
                defaultValue={city}
                showSearch
                className="rounded-0 shadow"
                onChange={handleFromCity}
              >
                {cityItems}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Title level={3}>Input CSV Data</Title>
        <Form.Item>
          <Input.Group compact>
            <Form.Item>
              <Input.Group compact>
                <Form.Item>
                  <Input
                    onChange={handleFileChange}
                    name="file"
                    type={"file"}
                    accept={".csv"}
                  />
                </Form.Item>
                <Form.Item>
                  <Button onClick={uploadFileHandler}>Upload</Button>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item label="Manual CSV Data Input">
          <TextArea id="manual-csv-data" rows={15} value={textFieldData} />
        </Form.Item>
      </Form>
    </div>
  );

  const outputContent = (
    <div>
      <Title level={3}>Personal Information</Title>
      <div>
        <span>
          <b>Name:</b>
        </span>
        <span style={{ margin: 50 }}>{nameFormated}</span>
        <span>
          <b>Email:</b>
        </span>
        <span style={{ margin: 50 }}>{email}</span>
      </div>
      <div>
        <span>
          <b>Gender:</b>
        </span>
        <span style={{ margin: 50 }}>{gender}</span>
        <span>
          <b>Country:</b>
        </span>
        <span style={{ margin: 50 }}>{country}</span>
      </div>
      <div>
        <span>
          <b>Age:</b>
        </span>
        <span style={{ margin: 75 }}>{age}</span>
        <span>
          <b>City:</b>
        </span>
        <span style={{ margin: 50 }}>{city}</span>
      </div>
      <Title level={3}>Data</Title>
      <Form.Item>
        <Input.Group compact>
          <Table
            style={{ width: "50%" }}
            columns={columns}
            dataSource={csvData}
          />
          <Column style={{ width: "50%" }} {...config} />
        </Input.Group>
      </Form.Item>
    </div>
  );

  const contentList: Record<string, React.ReactNode> = {
    input: inputContent,
    output: outputContent,
  };
  return (
    <>
      <Card
        style={{ width: "100%" }}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={(key) => {
          onTab1Change(key);
        }}
      >
        {contentList[activeTabKey1]}
      </Card>
    </>
  );
};

export default App;
