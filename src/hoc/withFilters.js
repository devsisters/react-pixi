import React, { useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { hasKey, isFunction, not } from '../helpers'
import invariant from 'fbjs/lib/invariant'

export const withFilters = (WrapperComponent, filters) => {
  invariant(typeof filters === 'object', 'Second argument needs to be an indexed object with { prop: Filter }')

  const keys = Object.keys(filters)

  const Wrapper = ({ children, apply, ...props }) => {
    // create filters
    const filterList = useRef(
      useMemo(() => {
        return keys.map(prop => {
          // FIXME: https://github.com/rollup/rollup/issues/3469
          const filterProp = props[prop] || {}
          const constructorArgs = filterProp.construct || []
          return new filters[prop](...constructorArgs)
        })
      }, [keys])
    )

    const filterObj = useMemo(() => {
      return keys.reduce((all, c, i) => ({ ...all, [c]: filterList.current[i] }), {})
    }, [keys])

    // get rest props
    const restProps = useMemo(() => {
      return Object.keys(props)
        .filter(not(hasKey(keys)))
        .reduce((all, c) => ({ ...all, [c]: props[c] }), {})
    }, [props, keys])

    // update filter params
    keys.forEach((k, i) => Object.assign(filterList.current[i], props[k]))

    // use apply ?
    if (apply && isFunction(apply)) {
      apply.call(WrapperComponent, filterObj)
    }

    return (
      <WrapperComponent {...restProps} filters={filterList.current}>
        {children}
      </WrapperComponent>
    )
  }

  Wrapper.displayName = 'FilterWrapper'

  Wrapper.propTypes = {
    children: PropTypes.node,
    apply: PropTypes.func,
  }

  return Wrapper
}
