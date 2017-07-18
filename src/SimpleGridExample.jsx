import React, {Component} from "react";
import {AgGridReact} from "ag-grid-react";

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: this.createColumnDefs(),
      rowData: this.createRowData(),
      emp1: '',
      emp2: '',
      emp: ''
    };

    this.setEmp1 = this.setEmp1.bind(this);
    this.setEmp2 = this.setEmp2.bind(this);
    this.setEmp = this.setEmp.bind(this);
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
        editable: true,
        width: 250
      }, {
        headerName: "ParentId",
        field: "parentId",
        editable: true,
        width: 250
      }, {
        headerName: "JoiningDate",
        field: "joinDate",
        width: 250
      }
    ];
  }

  createRowData() {
    return [
    ];
  }

  componentDidMount() {
    this.getUserList();
  }

  getUserList() {
    fetch('http://localhost:8000/phonetool/all', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => response.json()).then((responseJson) => {
      this.setState({rowData: responseJson.data})
    }).catch((error) => {
      console.error(error);
    });
  }

  getSubTree(emp) {
    fetch('http://localhost:8000/phonetool/subtree/' + emp, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => response.json()).then((responseJson) => {
    if(responseJson.status == 200){
    responseJson.data && this.setState({rowData: responseJson.data});}
    else{
    this.emptySheet();
    }
    }).catch((error) => {
      console.error(error);
    });
  }

  getSubTreeJDate(emp) {
    fetch('http://localhost:8000/phonetool/subtree/joindate/' + emp, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => response.json()).then((responseJson) => {
    if(responseJson.status == 200){
    responseJson.data && this.setState({rowData: responseJson.data});}
    else{
    this.emptySheet();
    }
    }).catch((error) => {
      console.error(error);
    });
  }

  getTree(emp) {
    fetch('http://localhost:8000/phonetool/tree/' + emp, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => response.json()).then((responseJson) => {
    if(responseJson.status == 200){
    responseJson.data && this.setState({rowData: responseJson.data});}
    else{
    this.emptySheet();
    }
    }).catch((error) => {
      console.error(error);
    });
  }

  postUserList(data) {
    fetch('http://localhost:8000/phonetool/createtree', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    }).then((response) => response.json()).then((responseJson) => {
      if(responseJson.status != 200){
      alert("OOPS! Something went Wrong")
      }
      this.getUserList();
    }).catch((error) => {
      console.error(error);
    });
  }

  getShortestPath(emp1, emp2) {
    fetch('http://localhost:8000/phonetool/shortestpath/' + emp1 + '/' + emp2, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => response.json()).then((responseJson) => {
      if(responseJson.status == 200){
      responseJson.data && this.setState({rowData: responseJson.data});}
      else{
      this.emptySheet();
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  emptySheet(){
   this.setState({rowData: []});
  }

  updateList() {
    this.postUserList(this.state.rowData);
  }

  shortestpath() {
    this.getShortestPath(this.state.emp1, this.state.emp2);
  }

  subtreejoindate() {
  this.getSubTreeJDate(this.state.emp);
  }

  subtree(){
  this.getSubTree(this.state.emp);
  }

  tree(){
  this.getTree(this.state.emp);
  }


  setEmp1(e) {
    this.setState({'emp1': e.target.value});
  };
  setEmp2(e) {
    this.setState({'emp2': e.target.value});
  };

  setEmp(e) {
    this.setState({'emp': e.target.value});
  };

  render() {
    let containerStyle = {
      height: 300,
      width: 600
    };

    return (
      <div style={containerStyle} className="ag-fresh">
        <h1>PhoneTool</h1>
        <AgGridReact // properties
          columnDefs={this.state.columnDefs} rowData={this.state.rowData} // events
          onGridReady={this.onGridReady}></AgGridReact>
        <button onClick={() => this.updateList()}>update</button>
        <form>
          <input type="number" name="Employee1Id" placeholder="employeeId1" value={this.state.emp1} onChange={this.setEmp1}/>
          <input type="number" name="Employee2Id" placeholder="employeeId2" value={this.state.emp2} onChange={this.setEmp2}/>
          <button type="button" onClick={() => this.shortestpath()}>shortest path</button>
        </form>
        <form>
          <input type="number" name="Employee1IdSubtree" placeholder="employeeId" value={this.state.emp} onChange={this.setEmp}/>
          <button type="button" onClick={() => this.subtree()}>SubTree</button>
          <button type="button" onClick={() => this.subtreejoindate()}>GreaterJoindate</button>
          <button type="button" onClick={() => this.tree()}>Tree</button>
        </form>

      </div>
    )
  }
};
