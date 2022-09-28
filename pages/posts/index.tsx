import type { GetServerSideProps } from "next";
import { Main } from "../../components/Layouts";

export default function Posts() {
  return <Main>Hello world!</Main>;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  return { props: {} };
};
