import { useNavigate } from 'react-router-dom'
import './_transactionsGroup.scss'
import type { GroupedEntries } from '../../Book'

const TransactionsGroup = ({entries}:{entries:GroupedEntries[]}) => {
  const navigate = useNavigate()
  return (
    <section className='transactions-group'>
      {entries&& entries.map(item=>
        <div className='entries-group'>
          <p>{item.groupDate}</p>
          {item?.entries?.map(entry=>
            <div className='entry bg-gray-100' onClick={()=>navigate(`${entry.id}`)}>
              <div className="flex justify-between items-center mb-1">
                <p className='entry-method'>{entry.entryType===1?'Cash in':'Cash out'}</p>
                {entry.categoryName && (
                  <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border">
                    {entry.categoryName}
                  </span>
                )}
              </div>
              <div className='entry-info'>
                <span className='entry-name'>{entry.name}</span>
                <div className="flex flex-col items-end">
                  <span className={`entry-total ${entry.entryType===1?'text-success':'text-danger'}`}>{entry.amount}</span>
                  <span className="text-xs text-gray-500 font-normal mt-0.5">Bal: {entry.balanceAfter}</span>
                </div>
              </div>
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