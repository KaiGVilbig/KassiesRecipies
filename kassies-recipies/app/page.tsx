import Image from "next/image";

import Layout from '@/components/Layout'
import style from '@/styles/Home.module.css'
import Recipies from "@/components/Recipies";
import { ReduxProvider } from '@/redux/provider';

export default function Home() {
  return (
    <ReduxProvider>
      <Layout>
        <h1 className={style.title}>
          Kassie's Yummy Recipies
        </h1>
        <Recipies />
      </Layout>
    </ReduxProvider>
  );
}
