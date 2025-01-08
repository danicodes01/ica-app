'use client'
import * as React from 'react'

type Props = {
  params: Promise<{
    slug: string
  }>
}
 
export default function Page({ params }: Props) {
  // Properly unwrap the params Promise using React.use()
  const resolvedParams = React.use(params)
  
  return <p>welcom to {resolvedParams.slug} 🛸</p>
}