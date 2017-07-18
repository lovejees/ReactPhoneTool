import React, {Component} from "react";
import {AgGridReact} from "ag-grid-react";
// import MoodRenderer from "./MoodRenderer";
// import MoodEditor from "./MoodEditor";
import NumericEditor from "./NumericEditor";

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: this.createColumnDefs(),
      rowData: this.createRowData(),
      emp1: '',
      emp2: ''
    };

    this.setEmp1 = this.setEmp1.bind(this);
    this.setEmp2 = this.setEmp2.bind(this);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  createColumnDefs() {
    return [
      {
        headerName: "EmployeeId",
        field: "employeeId",
        width: 300
      }, {
        headerName: "Name",
        field: "name",
        // cellRendererFramework: MoodRenderer,
        // cellEditorFramework: MoodEditor,
        editable: true,
        width: 250
      }, {
        headerName: "ParentId",
        field: "parentId",
        cellEditorFramework: NumericEditor,
        editable: true,
        width: 250
      }, {
        headerName: "JoiningDate",
        field: "joinDate",
        cellEditorFramework: NumericEditor,
        editable: true,
        width: 250
      }
    ];
  }

  createRowData() {
    return [
      {
        "name": "b",
        "employeeId": 1005,
        "parentId": 1000,
        "joinDate": "2012-04-24"
      }, {
        "name": "e",
        "employeeId": 1035,
        "parentId": 1000,
        "joinDate": "2014-07-12"
      }, {
        "name": "t",
        "employeeId": 2001,
        "parentId": 1000,
        "joinDate": null
      }
    ];
  }

  componentDidMount() {
    this.getUserList();
  }

  getUserList() {
    fetch('http://192.168.30.79:8000/phonetool/tree/1000', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => response.json()).then((responseJson) => {
      this.setState({rowData: responseJson.data});
      console.log(responseJson.data);
    }).catch((error) => {
      console.error(error);
    });
  }

  postUserList(data) {
    fetch('http://192.168.30.79:8000/phonetool/createtree', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }).then((response) => response.json()).then((responseJson) => {
      responseJson.data && this.setState({rowData: responseJson.data});
      console.log(responseJson.data);
    }).catch((error) => {
      console.error(error);
    });
  }

  getShortestPath(emp1, emp2) {
    fetch('http://192.168.30.79:8000/phonetool/shortestpath/' + emp1 + '/' + emp2, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => response.json()).then((responseJson) => {
      responseJson.data && this.setState({rowData: responseJson.data});
      console.log(responseJson.data);
    }).catch((error) => {
      console.error(error);
    });
  }

  updateList() {
    this.postUserList(this.state.rowData);
    console.log(this.state.rowData);
  }

  shortestpath() {
    console.log(this.state.emp1, this.state.emp2);
    this.getShortestPath(this.state.emp1, this.state.emp2);
  }

  setEmp1(e) {
    console.log(e.target.value);
    this.setState({'emp1': e.target.value});
  };
  setEmp2(e) {
    console.log(e.target.value);
    this.setState({'emp2': e.target.value});
  };

  render() {
    let containerStyle = {
      height: 115,
      width: 600
    };

    return (
      <div style={containerStyle} className="ag-fresh">
        <h1>Simple ag-Grid React Example</h1>
        <AgGridReact // properties
          columnDefs={this.state.columnDefs} rowData={this.state.rowData} // events
          onGridReady={this.onGridReady}></AgGridReact>
        <button onClick={() => this.updateList()}>update</button>
        <form>
          <input type="number" name="email" placeholder="employeeId" value={this.state.emp1} onChange={this.setEmp1}/>
          <input type="number" name="password" placeholder="employeeId" value={this.state.emp2} onChange={this.setEmp2}/>
          <button type="button" onClick={() => this.shortestpath()}>shortest path</button>
        </form>
      </div>
    )
  }
};
