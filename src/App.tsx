
import Home from './pages/home/Home';
import Login from './pages/login/Login';import { Routes, Route } from "react-router-dom";
import Signup from './pages/signUp/SignUp';
import Book from './pages/book/Book';
import AddEntry from './pages/addEntry/AddEntry';
import PageNotFound from './components/PageNotFound';
import EntryDetails from './pages/entryDetails/EntryDetails';
import EditEntry from './pages/editEntry/editEntry';
import Settings from './pages/Settings/settings';
import ProfileScreen from './pages/Settings/pages/profile';
import PhotoScreen from './pages/Settings/pages/photoScreen';
import SecurityScreen from './pages/Settings/pages/security';
import DeleteAccountScreen from './pages/Settings/pages/deleteAccount';
import Categories from './pages/Categories/categories';
import PaymentMethods from './pages/PaymentMethods/PaymentMethods';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/categories" element={<Categories />}/>
      <Route path="/payment-methods" element={<PaymentMethods />}/>
      <Route path="/settings" element={<Settings />}/>
      <Route path="/settings/profile" element={<ProfileScreen />} />
      <Route path="/settings/profile-pic" element={<PhotoScreen />} />
      <Route path="/settings/security" element={<SecurityScreen />} />
      <Route path="/settings/delete-account" element={<DeleteAccountScreen />} />
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
