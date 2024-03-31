import { FC } from 'react';
import data from '@/data';

export const Sidebar: FC = () => {
  return <nav className='sidebar__navigation flex flex-col min-w-52 overflow-hidden text-wrap p-6 min-h-screen bg-gray-100'>
    <ul className='sidebar__navigation-links'>
    {data.titles.map((title,i) =>
      <li key={i} className='sidebar__navigation-link my-4 text-xl'>
        <a href={'#'+i}>{title}</a>
      </li>
    )}
    </ul>
  </nav>
}