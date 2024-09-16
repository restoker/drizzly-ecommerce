// import getPosts from "@/server/actions/get-posts";
'use client';
import SearchBar from "@/components/SearchBar";
import { searchStore } from "@/store/searchStore";

export default function Home() {
  // const resp = await getPosts();
  // console.log(resp);
  const open = searchStore(state => state.open);
  // console.log(open);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {open ? <SearchBar /> : null}
      <h1 className="text-cyan-400">Afu</h1>
    </main>
  );
}
