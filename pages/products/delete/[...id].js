/* eslint-disable react/no-unescaped-entities */
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const router = useRouter()
    const [productInfo, setProductInfo] = useState()
    const { id } = router.query
     
    useEffect(() => {
        if (!id) {
            return
        }
        axios.get(`/api/products?id=${id}`).then(response => {
            setProductInfo(response.data)
        })
    }, [id])

    function goBack() {
        router.push('/products')
    }

    function deleteProduct() {
        axios.delete(`/api/products?id=${id}`).then(response => {})
        goBack()
    }

    return (
        <Layout>
            <h1 className="text-center">Você realmente deseja deletar &nbsp;"{productInfo?.title}"</h1>
            <div className="flex gap-1 justify-center">
                <button className="btn-yes" onClick={deleteProduct}>Sim</button>
                <button className="btn-no" onClick={goBack}>Não</button>
            </div>
        </Layout>
    )
}