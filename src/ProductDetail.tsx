import React, {useState} from "react";
import axios from 'axios';

interface Product {
    id: string;
    name: string;
    price: string;
    picture: string;
    description: string;
}

interface ProductDetailProps {
    product: Product;
    onClose: () => void;
}

function ProductDetail({product, onClose}: ProductDetailProps) {
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [picture, setPicture] = useState(product.picture);
    const [description, setDescription] = useState(product.description);

    const handleEdit = async () => {
        try {
            const updatedProduct = {
                id: product.id,
                name,
                price,
                picture,
                description
            }
            const response = await axios.put(`http://localhost:3000/products/${product.id}`, updatedProduct);
            console.log(response);
            alert("Product has been edited successfully!");
        } catch (error) {
            console.log(error);
            alert("An error occured while editing the product!");
        }
    }

    return (
        <div className="container">
            <div className="card">
                <img src={picture} className="card-img-top" alt={name}/>
                <div className="card-body">
                    <h2 className="card-title">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control"/>
                    </h2>
                    <p className="card-text">
                        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control"/>
                    </p>
                    <p className="card-text">
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control"/>
                    </p>
                    <button onClick={handleEdit} className="btn btn-primary">Edit</button>
                    <button onClick={onClose} className="btn btn-secondary">Back</button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;
