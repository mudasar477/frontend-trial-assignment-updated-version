import React, { useState} from 'react';
import { Card, Button, Form, Input, Select, Typography, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Column } from '@ant-design/plots';
import countryList from 'react-select-country-list'
import Papa, { ParseResult } from "papaparse"
import './App.css';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

type Data = {
  Product: string,
  Price: number,
}

type Values = {
  data: Data[]
}

class CsvDataItem {
  Product: string;
  Price: number;

  constructor(value: Data){
    this.Product = value.Product;
    this.Price = +value.Price;
  }
}

const columns: ColumnsType<Data> = [
  {
    title: 'Product',
    dataIndex: 'Product',
    key: 'Product',
  },
  {
    title: 'Price',
    dataIndex: 'Price',
    key: 'Price',
  },
];

var csvData: Data[];

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const ageItems = [<option key={0} value={0}>{0}</option>];

for (let i = 1; i <= 120; i++) {             
  ageItems.push(<option key={i} value={i}>{i}</option>);   
  //here I will be creating my options dynamically based on
  //what props are currently passed to the parent component
}

const tabList = [
  {
    key: 'input',
    tab: 'Input',
  },
  {
    key: 'output',
    tab: 'Output',
  },
];

const App: React.FC = () => {
  const [activeTabKey1, setActiveTabKey1] = useState<string>('input');
  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };

  // This state will store user's name
  const [name, setName] = useState("");

  //This state will store user's gender
  const [gender, setGender] = useState("");

  //This state will store user's age
  const [age, setAge] = useState(Number);

  //This state will store user's email
  const [email, setEmail] = useState("");

  //This state will store user's country
  const [country, setCountry] = useState("");

  //This state will store user's city
  const [city, setCity] = useState("");

  // This state will store the parsed data
  const [data, setData] = useState<Values | undefined>();

  const [textFieldData, setTextFieldData] = useState<Values | undefined>();
   
  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");
   
  // It will store the file uploaded by the user
  const [file, setFile] = useState("");
  
  var config = {
    data: csvData,
    xField: 'Product',
    yField: 'Price',
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
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
              csvData = results?.data.map(item => new CsvDataItem(item));
            },
          })
      }
  };
  
  const uploadFileHandler = () => {
       
      // If user clicks the parse button without
      // a file we show a error
      if (!file) return setError("Enter a valid file");
      
      console.log(data?.data);
      setTextFieldData(data);
      data?.data.forEach(function (value) {
        console.log(value);
      }); 
      
  };

  const inputContent = <div>
  
  <Form >
  <Title level={3}>User</Title>
    <Form.Item >
      <Input.Group compact>
        <Form.Item label="Name">
              <Input placeholder="Last name First name" onChange={e => setName(e.target.value)} value={name}/>
        </Form.Item>
        <Form.Item label="Gender">
        <Select defaultValue={gender} showSearch style={{ width: 200 }} onChange={e => setGender(e)} placeholder="Please select gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="unspecified">Unspecified</Option>
        </Select>
        </Form.Item>
        <Form.Item label="Age">
        <Select defaultValue={age}
          showSearch
          style={{ width: 200 }}
          onChange={e => setAge(e)}
          placeholder="Please select age"
        >
          {ageItems}
        </Select>
        </Form.Item>
      </Input.Group>
    </Form.Item>
    <Form.Item >
      <Input.Group compact>
        <Form.Item label="Email">
              <Input onChange={e => setEmail(e.target.value)} value={email}/>
        </Form.Item>
        <Form.Item label="Country">
          <Select 
            defaultValue={country}
            showSearch 
            style={{ width: 200 }} 
            placeholder="Please select country" 
            onChange={e => setCountry(e)}
            options={countryList().getData()}
          />
        </Form.Item>
        <Form.Item label="City">
          <Select
            defaultValue={city}
            showSearch
            style={{ width: 200 }}
            placeholder="Please select city"
            onChange={e => setCity(e)}
            options={countryList().getData()}
          />
        </Form.Item>
      </Input.Group>
    </Form.Item>
    <Title level={3}>Input CSV Data</Title>
    <Form.Item >
          <Input.Group compact>
          <Form.Item >
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
        <TextArea id="manual-csv-data" rows={15} value={
          `Product, Price\n` + 
          textFieldData?.data.map((value, index) => {
            return (
              `${value.Product}, ${value.Price}\n`
            );
          })
        }/>
      </Form.Item>
  </Form>
</div>;

const outputContent = <div>
  <Title level={3}>Personal Information</Title>
  <div>
    <span><b>Name:</b></span>
    <span style={{ margin: 50 }}>{name}</span>
    <span><b>Email:</b></span>
    <span style={{ margin: 50 }}>{email}</span>
  </div>
  <div>
    <span><b>Gender:</b></span>
    <span style={{ margin: 50 }}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
    <span><b>Country:</b></span>
    <span style={{ margin: 50 }}>{country.charAt(0).toUpperCase() + country.slice(1)}</span>
  </div>
  <div>
    <span><b>Age:</b></span>
    <span style={{ margin: 75 }}>{age}</span>
    <span><b>City:</b></span>
    <span style={{ margin: 50 }}>{city.charAt(0).toUpperCase() + city.slice(1)}</span>
  </div>
  <Title level={3}>Data</Title>
  <Table columns={columns} dataSource={csvData} />
  <Column {...config} />
</div>;

const contentList: Record<string, React.ReactNode> = {
  input: inputContent,
  output: outputContent,
};
  return (
    <>
      <Card
        style={{ width: '100%'}}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={key => {
          onTab1Change(key);
        }}
      >
        {contentList[activeTabKey1]}
      </Card>
      
    </>
  );
};

export default App;