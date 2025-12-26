import React from 'react'

const OrderLoader = ({color}) => {
  return (
    <div className={`animate-spin inline-block size-6 border-3 border-current border-t-transparent  rounded-full ${color ? `text-${color}` : 'text-blue-500'}dark:text-blue-500`} role="status" aria-label="loading">
  <span className="sr-only">Loading...</span>
</div>
  )
}

export default OrderLoader