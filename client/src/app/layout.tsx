import './globals.css'
import 'w3-css/w3.css';

import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'

// const inter = Inter({ 
//   subsets: ['latin'] 
// })

export const metadata: Metadata = {
  title: 'Aizu Mujin',
  description: 'Powered by AWTS in University of Aizu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (    
    <html lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body className='font-jpfont w-screen'>{children}</body>
    </html>
  )
}
