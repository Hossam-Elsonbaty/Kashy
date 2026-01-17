import { useNavigate } from 'react-router-dom'
import './_transactionsGroup.scss'
import type { GroupedEntries } from '../../Book'

const TransactionsGroup = ({entries}:{entries:GroupedEntries[]}) => {
  const navigate = useNavigate()
  console.log(entries);
  return (
    <section className='transactions-group'>
      {entries&& entries.map(item=>
        <div className='entries-group'>
          <p>{item.groupDate}</p>
          {item?.entries?.map(entry=>
            <div className='entry bg-gray-100 p-1' onClick={()=>navigate(`${entry.id}`)}>
              {/* <p className='entry-method'>{entry.entryType===1?'Cash in':'Cash out'}</p> */}
              <p className='entry-info'>
                <span className='entry-name'>{entry.name}</span>
                <span className={`entry-total ${entry.entryType===1?'text-success':'text-danger'}`}>{entry.amount}</span>
              </p>
              {(entry.categoryName || entry.paymentMethodName) &&
                <div className='flex gap-2 items-center p-2'>
                  {entry.categoryName && 
                  <p className='bg-[#f0b100] text-xs p-1 rounded-sm text-gray-900'>{entry.categoryName}</p>
                  }
                  {entry.paymentMethodName && 
                  <p className='bg-gray-400 text-xs p-1 rounded-sm text-gray-900'>{entry.categoryName}</p>
                  }
                </div>              
              }
              <p className='entry-date'>
                <span style={{color:'var(--main-color)'}}>Entered by {entry.createdBy}</span>
                <span> at {entry.createdAtDate}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default TransactionsGroup