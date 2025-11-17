import TopProduct from "../components/TopProduct";
import { fakeFetchItems } from "../services/fakeFetch";

export default function Home() {
    return (
        <>
            <TopProduct title={"Top 5 sản phẩm gần kết thúc"} fetchFunc={fakeFetchItems}></TopProduct>
            <TopProduct title={"Top 5 sản phẩm gần kết thúc"} fetchFunc={fakeFetchItems}></TopProduct>
            <TopProduct title={"Top 5 sản phẩm gần kết thúc"} fetchFunc={fakeFetchItems}></TopProduct>
        </>
    )
}
