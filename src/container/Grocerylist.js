import React, { Component } from "react";
import Axios from "axios";

import Auxiliary from "../hoc/Auxiliary";

import List from "../component/List";
import AddInput from "../component/AddInput";
import EditInput from "../component/EditInput";

import "./GroceryList.css";

class GroceryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isAdd: false,
      isEdit: false,
      itemName: "",
      itemKey: "",
      itemDetail: ""
    };
  }

  switchToAdd() {
    this.setState({
      isAdd: true,
      isEdit: false
    });
  }

  cancelEdit() {
    this.setState({
      isAdd: false,
      isEdit: false
    });

    this.setState({
      itemName: "",
      itemKey: "",
      itemDetail: ""
    });
  }

  onItemComplete(itemKey, itemCompleted) {
    Axios.patch(`http://localhost:3004/list/${itemKey}`, {
      purchased: !itemCompleted
    }).then(() => {
      window.location.reload();
    });
  }

  onItemEdit(itemKey, itemName, itemDetail) {
    console.log(itemKey, itemName, itemDetail);

    if(this.state.isEdit) {
      this.setState({
        isAdd: false,
        isEdit: false,
        itemName: itemName,
        itemKey: itemKey,
        itemDetail: itemDetail
      });
    } else {
      this.setState({
        isAdd: false,
        isEdit: true,
        itemName: itemName,
        itemKey: itemKey,
        itemDetail: itemDetail
      });
    }
  }

  onItemDelete(itemName, itemKey) {
    let result = window.confirm(`Would you like to delete ${itemName}?`);

    if (result) {
      Axios.delete(`http://localhost:3004/list/${itemKey}`);
      window.location.reload();
    }
  }

  componentDidMount() {
    Axios.get("http://localhost:3004/list").then(res => {
      this.setState({
        items: res.data
      });
    });
  }

  render() {
    return (
      <Auxiliary>
        <header className="App-header">
          <h1 className="App-title">Grocery List</h1>
        </header>

        {this.state.isAdd ? (
          <div>
            <AddInput>
              <button
                onClick={this.cancelEdit.bind(this)}
                className="form-button"
              >
                Cancel Add
              </button>
            </AddInput>
          </div>
        ) : (
          ""
        )}

        {this.state.isEdit ? (
          <div>
            <EditInput
              itemName={this.state.itemName}
              itemId={this.state.itemKey}
              itemDetail={this.state.itemDetail}
            >
              <button
                className="form-button"
                onClick={this.cancelEdit.bind(this)}
              >
                Cancel Edit
              </button>
            </EditInput>
          </div>
        ) : (
          ""
        )}

        <button className="add-button" onClick={this.switchToAdd.bind(this)}>
          Add new item
        </button>

        <List
          items={this.state.items}
          complete={this.onItemComplete.bind(this)}
          edit={this.onItemEdit.bind(this)}
          delete={this.onItemDelete.bind(this)}
        />
      </Auxiliary>
    );
  }
}

export default GroceryList;
