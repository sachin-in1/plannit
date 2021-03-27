import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

class TablePeople extends Component {

  render() {

    let people = this.props.people;

    people = people.map((user) => 
      <Table.Row key={user._id}>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>{user.password}</Table.Cell>
      </Table.Row>
    );
    people =  [...people].reverse();

    return (
      <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Password</Table.HeaderCell>
            {/* <Table.HeaderCell>Actions</Table.HeaderCell>  */}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {people}
        </Table.Body>
      </Table>
    );
  }
}

export default TablePeople;
