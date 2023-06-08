/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SpinnerSyncLoader from "./spinnerSuncLoader";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {})
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUpLoading, setIsUpLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter()
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
        })
    }, [])

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title, description, price, images, category,
            properties: productProperties,
        }

        if (_id) {
            //update
            await axios.put('/api/products', { ...data, _id })
        } else {
            //create
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }

    if (goToProducts) {
        router.push('/products')
    }

    async function uploadImages(ev) {
        const files = ev.target?.files
        if (files?.length > 0) {
            setIsUpLoading(true)
            const data = new FormData()
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUpLoading(false)
        }
    }

    function updateImagesOrder(images) {
        setImages(images)
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev }
            newProductProps[propName] = value
            return newProductProps
        })
    }

    const propertiesToFill = []
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category)
        propertiesToFill.push(...catInfo.properties)
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id)
            propertiesToFill.push(...parentCat.properties)
            catInfo = parentCat
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label htmlFor="">Nome do Produto</label>
            <input
                type="text"
                placeholder="nome do produto"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
            />
            <label>Category</label>
            <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div key={p.name} className="">
                    {/* <div>{p.name}</div> */}
                    <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                    <div>
                    <select
                        value={productProperties[p.name]}
                        onChange={ev => setProductProp(p.name, ev.target.value)}
                    >
                        {p.values.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                    </div>
                </div>
            ))}
            <label htmlFor="">Fotos</label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable
                    className="flex flex-wrap gap-2"
                    list={images}
                    setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-32">
                            <img src={link} alt="" className="rounded-lg" />
                        </div>
                    ))}
                </ReactSortable>
                {isUpLoading && (
                    <div className="h-32 p-1 flex items-center">
                        <SpinnerSyncLoader />
                    </div>
                )}
                <label className="w-32 h-32 text-gray-500 font-medium border flex items-center justify-center gap-1 rounded-lg bg-gray-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>

                    Upload
                    <input type="file" className="hidden" onChange={uploadImages} />
                </label>
            </div>
            <label htmlFor="">Descrição do Produto</label>
            <textarea
                name=""
                placeholder="descrição"
                id=""
                cols="30"
                rows="5"
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
            ></textarea>
            <label htmlFor="">Preço do Produto (em R$)</label>
            <input
                type="number"
                placeholder="preço"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
            />
            <button
                type="submit"
                className="btn-primary">
                Salvar
            </button>
        </form>
    );
}