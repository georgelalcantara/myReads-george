import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Shelf from './Shelf';
import Add from './Add';
import * as BooksAPI from './BooksAPI';
import './App.css';

class BooksApp extends React.Component {
    state = {
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({ books });
    })
  }

  shelfMove = (bookMoved, shelf) => {
      BooksAPI.update(bookMoved, shelf).then(response => {
        bookMoved.shelf = shelf;
        this.setState(oldState => ({
          books: oldState.books
          .filter(book => book.id !== bookMoved.id)
          .concat(bookMoved)
        }));
      });
    };

  renderBooks = () => {
    const SHELVES = [
      ['Currently Reading', 'currentlyReading'],
      ['Want to Read', 'wantToRead'],
      ['Read', 'read']
    ]

    return (
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          {SHELVES.map((shelf, index) => (
            <Shelf
              key={index}
              shelfMove={this.shelfMove}
              shelfCont={shelf[0]}
              books={this.state.books.filter(a => a.shelf === shelf[1])} />
          ))}
          <div className="open-search">
            <Link to='/search'>Add a book</Link>
          </div>
        </div>
      );
  }

  render() {
    return (
      <div>
        <Route exact path='/' render={this.renderBooks}/>
        <Route path='/search' render={({ history }) => (
          <Add
            newBook={this.state.books}
            adding={(book, shelf) => {
              this.shelfMove(book, shelf);
            }}
          />
        )}/>
      </div>
    );
  }
}

export default BooksApp;
