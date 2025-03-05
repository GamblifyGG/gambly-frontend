import React, { useState } from 'react'
import Iconify from '@/components/common'

const Search = () => {
  return (
    <div className="header-search relative">
      <input type="search" placeholder="Search Casinos" className="bg-dark-500 rounded-2xl border border-dark-250" />
      <Iconify icon="uil:search" className="_icon" />
    </div>
  )
}

export default Search