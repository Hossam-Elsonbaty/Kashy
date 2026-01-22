import { useNavigate } from 'react-router-dom'
import type { GroupedEntries } from '../../Book'

const TransactionsGroup = ({entries}:{entries:GroupedEntries[]}) => {
  const navigate = useNavigate()
  console.log(entries);
  return (
    <section className="p-2 flex flex-col gap-3">
    {entries && entries.map(item => (
      <div className="flex flex-col gap-3">
        <p className="text-gray-500 font-bold text-xs">{item.groupDate}</p>
        {item?.entries?.map(entry => (
          <div className="bg-gray-100 p-1 rounded-lg" onClick={() => navigate(`${entry.id}`)}>
            {/* <p className="text-primary-foreground text-center w-18 text-xs py-1 rounded-bl-lg rounded-br-lg">{entry.entryType === 1 ? 'Cash in' : 'Cash out'}</p> */}
            <p className="flex justify-between p-1">
              <span className="text-gray-800 font-semibold text-sm capitalize">{entry.name}</span>
              <span className={`text-sm ml-auto ${entry.entryType === 1 ? 'text-green-600' : 'text-red-600'}`}>{entry.amount}</span>
            </p>
            {(entry.categoryName || entry.paymentMethodName) && (
              <div className="flex gap-2 items-center p-2">
                {entry.paymentMethodName && (
                  <p className="bg-yellow-400 text-xs p-1 rounded-sm text-gray-800">{entry.paymentMethodName}</p>
                )}
                {entry.categoryName && (
                  <p className="bg-gray-300 text-xs p-1 rounded-sm text-gray-800">{entry.categoryName}</p>
                )}
              </div>
            )}
            <p className="text-xs p-2 border-t border-gray-300">
              <span className="text-yellow-400 font-semibold text[10px]">Entered by {entry.createdBy}</span>
              <span className="text-gray-400 font-semibold text-[9px] ml-1">at {entry.createdAtDate}</span>
            </p>
          </div>
        ))}
      </div>
    ))}
  </section>
  )
}

export default TransactionsGroup