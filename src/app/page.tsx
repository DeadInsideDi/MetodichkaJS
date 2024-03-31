import { Sidebar } from "@/components/headers/Sidebar";
import data from '@/data';

export default function Home() {
  return (
    <main className="flex">
      <Sidebar></Sidebar>
      <div className="min-h-screen p-8">
      {data.texts.map((text,i) =>
        <span
          key={i}
          id={String(i)}
          dangerouslySetInnerHTML={{ __html: text }}
          className='text text-2xl text-wrap'
        />
      )}
      </div>
      
    </main>
  );
}