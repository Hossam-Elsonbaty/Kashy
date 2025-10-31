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
              <p className='entry-method'>{entry.entryType===1?'Cash in':'Cash out'}</p>
              <p className='entry-info'>
                <span className='entry-name'>{entry.name}</span>
                <span className={`entry-total ${entry.entryType===1?'text-success':'text-danger'}`}>{entry.amount}</span>
              </p>
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