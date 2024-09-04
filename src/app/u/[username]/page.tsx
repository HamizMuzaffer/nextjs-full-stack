"use client"

import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const params = useParams<{username: string}>()
  return (
    <div>{params.username}</div>
  )
}

export default page