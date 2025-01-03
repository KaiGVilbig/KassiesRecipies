import Image from "next/image";

import Layout from '@/components/Layout'
import style from '@/styles/Home.module.css'
import Recipies from "@/components/Recipies";
import Navbar from "@/components/Navbar";
import { ReduxProvider } from '@/redux/provider';

export default function Home() {
  return (
    <ReduxProvider>
      <Layout>
        <Navbar />
        <Recipies />
      </Layout>
    </ReduxProvider>
  );
}
