import { AddBtn } from './components/AddNewBtn/AddBtn';
import Book from './components/cashbook/Book';
import Filter from './components/filter/Filter';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import './_home.scss'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cashbooksAction } from '../../store/slices/cashbooksSlice';
import Loader from '../../components/Loader';
import type { AppDispatch, RootState } from '../../store/Store';
const Home = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const dataTest = useSelector((state: RootState) => state.cashbooks.cashbooks)
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  useEffect(()=>{
    dispatch(cashbooksAction())
  },[dispatch])
  console.log(dataTest);
  return (
    <main className='home'>
      {isLoading?
      <Loader/>
      :
      <>
        <div className="container">
          <Navbar/>
          <AddBtn/>
          <Filter/>
          {dataTest?.map((item,i) => 
            <Book item={item} key={i} />
          )}
        </div>
        <Footer/>
      </>
      }
    </main>
  )
}

export default Home