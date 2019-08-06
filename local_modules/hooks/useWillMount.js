import { useRef } from 'react'


const useWillMount = (fn) => {
  const ref = useRef(false)

  if (!ref.current) {
    ref.current = true

    if (typeof fn === 'function') {
      fn()
    }
  }

  return ref.current
}


export default useWillMount
