import React from "react";
import logo from "./pulkitlogo.png";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    // props stands for properties
    super(props);
    this.state = {
      newItem: "",
      list: [],
    };
  }

  addItem(todoValue) {
    if (todoValue !== "") {
      const newItem = {
        id: Date.now(), // because everytime it's going to have a new value
        value: todoValue,
        isDone: false,
      };
      const list = [...this.state.list]; // here all the values are available in this list
      list.push(newItem);

      // we do not update state directly we update state using setState
      this.setState({
        list,
        newItem: "",
      });
    }
  }

  deleteItem(id) {
    const list = [...this.state.list];
    // now we need toupdate the list
    const updatedList = list.filter((item) => item.id != id);
    this.setState({
      list: updatedList,
    });
  }

  updateInput(input) {
    this.setState({ newItem: input });
  }

  render() {
    return (
      <div>
        <img src={logo} width="100" height="100" className="logo" />
        <h1 className="app-title">Pulkit Todo App</h1>
        <div className="container">
          <h4>Add an Item....</h4>
          <br />
          <input
            type="text"
            className="input-text"
            placeholder="Write a Todo"
            required
            value={this.state.newItem}
            onChange={(e) => this.updateInput(e.target.value)}
          ></input>
          <button
            className="add-btn"
            onClick={() => this.addItem(this.state.newItem)}
            disabled={!this.state.newItem.length} // this is a trick
          >
            Add Todo
          </button>
          <div className="list">
            <ul>
              {this.state.list.map(item => {
                return(
                    <li className="todo-list" key={item.id}>  
                    {/* we have to show that we are looping through all the different values that's why we use item.id*/}
                    <input
                    type="checkbox"
                    name="id"
                    checked={item.isDone}
                    onChange = {() => {}}
                    />
                    {item.value}
                    <button
                    className = "btn"
                    onClick={() => this.deleteItem(item.id)}
                    >Delete</button>
                    </li>
                );
              })}
              <li class="todo-list">
                <input type="checkbox" name="" id="" /> Record Youtube Videos
                <button className="btn">Delete</button>
              </li>
            </ul>
          </div>
        </div>
        <h5>Note: Make sure not to type lengthy string because I've hardCoded the Width for the todo</h5>

        <p>----Made by Pulkit Verma----</p>
      </div>
    );
  }
}

export default App;
