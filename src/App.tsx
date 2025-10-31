
import Home from './pages/home/Home';
import Login from './pages/login/Login';import { Routes, Route } from "react-router-dom";
import Signup from './pages/signUp/SignUp';
import Book from './pages/book/Book';
import AddEntry from './pages/addEntry/AddEntry';
import PageNotFound from './components/PageNotFound';
import EntryDetails from './pages/entryDetails/EntryDetails';
import EditEntry from './pages/editEntry/editEntry';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      {/* <Route path="/book" element={<Book />} /> */} 
      <Route path="/book/:id" element={<Book />} />
      <Route path="/book/:id/add-cash-entry" element={<AddEntry />} />
      <Route path="/book/:id/:entryId" element={<EntryDetails />} />
      <Route path="/book/:id/:entryId/edit-entry" element={<EditEntry />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
export default App
